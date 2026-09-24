import { NextRequest, NextResponse } from "next/server";

type CheckoutItem = {
  name?: string;
  quantity?: number;
  personalization?: "stock" | "custom";
  stockDesign?: number | null;
  photoName?: string | null;
};

const PRICE_MAP: Record<string, number> = {
  "Small Assistant": 250,
  "Large Face": 400,
};

function payuConfig() {
  const env = process.env.PAYU_ENV === "production" ? "production" : "sandbox";
  const baseUrl = env === "production"
    ? "https://secure.payu.com"
    : "https://secure.snd.payu.com";

  return {
    env,
    baseUrl,
    clientId: process.env.PAYU_CLIENT_ID || "",
    clientSecret: process.env.PAYU_CLIENT_SECRET || "",
    posId: process.env.PAYU_POS_ID || "",
  };
}

function supabaseConfig() {
  return {
    url: (process.env.SUPABASE_URL || "").replace(/\/$/, ""),
    secret: process.env.SUPABASE_SECRET_KEY || "",
  };
}

async function supabaseRequest(
  path: string,
  options: RequestInit = {}
) {
  const config = supabaseConfig();

  if (!config.url || !config.secret) {
    throw new Error("Supabase is not configured in environment variables.");
  }

  return fetch(config.url + "/rest/v1/" + path, {
    ...options,
    headers: {
      apikey: config.secret,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    cache: "no-store",
  });
}

async function getAccessToken(baseUrl: string, clientId: string, clientSecret: string) {
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret,
  });

  const response = await fetch(baseUrl + "/pl/standard/user/oauth/authorize", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("PayU authorization failed.");
  }

  const data = await response.json();
  if (!data.access_token) throw new Error("PayU did not return an access token.");
  return data.access_token as string;
}

async function updateDatabaseOrder(extOrderId: string, patch: Record<string, unknown>) {
  const response = await supabaseRequest(
    "orders?payu_ext_order_id=eq." + encodeURIComponent(extOrderId),
    {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ ...patch, updated_at: new Date().toISOString() }),
    }
  );

  if (!response.ok) {
    console.error("Supabase order update failed", response.status, await response.text());
  }
}

export async function POST(request: NextRequest) {
  let extOrderId = "";

  try {
    const { items, customer } = await request.json() as {
      items: CheckoutItem[];
      customer: Record<string, string>;
    };

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    }

    const requiredCustomerFields = [
      "email",
      "firstName",
      "lastName",
      "phone",
      "street",
      "postalCode",
      "city",
      "country",
    ];

    if (requiredCustomerFields.some((field) => !customer?.[field]?.trim())) {
      return NextResponse.json({ error: "Customer or shipping details are incomplete." }, { status: 400 });
    }

    const normalizedItems = items.map((item) => {
      const unitPricePln = PRICE_MAP[item.name || ""];
      if (!unitPricePln) throw new Error("Unknown product in cart.");

      return {
        name: item.name as string,
        personalization: item.personalization === "custom" ? "custom" : "stock",
        stockDesign: item.personalization === "stock" ? Number(item.stockDesign) || null : null,
        quantity: Math.max(1, Math.min(20, Number(item.quantity) || 1)),
        unitPricePln,
      };
    });

    const subtotalPln = normalizedItems.reduce(
      (sum, item) => sum + item.unitPricePln * item.quantity,
      0
    );

    extOrderId = "AM-" + Date.now() + "-" + crypto.randomUUID().slice(0, 8);

    const orderInsert = await supabaseRequest("orders", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        order_number: extOrderId,
        payu_ext_order_id: extOrderId,
        payment_status: "PENDING",
        order_status: "NEW",
        first_name: customer.firstName.trim(),
        last_name: customer.lastName.trim(),
        email: customer.email.trim(),
        phone: customer.phone.trim(),
        street: customer.street.trim(),
        postal_code: customer.postalCode.trim(),
        city: customer.city.trim(),
        country: customer.country.trim(),
        unit: customer.unit?.trim() || null,
        subtotal_pln: subtotalPln,
        note: customer.note?.trim() || null,
        updated_at: new Date().toISOString(),
      }),
    });

    if (!orderInsert.ok) {
      const detail = await orderInsert.text();
      console.error("Supabase order insert failed", orderInsert.status, detail);
      return NextResponse.json(
        { error: "Supabase order insert failed (" + orderInsert.status + "): " + detail.slice(0, 500) },
        { status: 500 }
      );
    }

    const insertedOrders = await orderInsert.json();
    const databaseOrder = insertedOrders?.[0];

    if (!databaseOrder?.id) {
      throw new Error("Database did not return the new order ID.");
    }

    const itemRows = normalizedItems.map((item) => ({
      order_id: databaseOrder.id,
      product: item.name,
      personalization: item.personalization,
      stock_design: item.stockDesign,
      photo_path: null,
      quantity: item.quantity,
      unit_price_pln: item.unitPricePln,
    }));

    const itemsInsert = await supabaseRequest("order_items", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify(itemRows),
    });

    if (!itemsInsert.ok) {
      const detail = await itemsInsert.text();
      console.error("Supabase item insert failed", itemsInsert.status, detail);
      return NextResponse.json(
        { error: "Supabase order_items insert failed (" + itemsInsert.status + "): " + detail.slice(0, 500) },
        { status: 500 }
      );
    }

    const config = payuConfig();
    if (!config.clientId || !config.clientSecret || !config.posId) {
      await updateDatabaseOrder(extOrderId, { payment_status: "PAYMENT_CONFIG_ERROR" });
      return NextResponse.json(
        { error: "PayU credentials are not configured in environment variables." },
        { status: 500 }
      );
    }

    const accessToken = await getAccessToken(config.baseUrl, config.clientId, config.clientSecret);
    const origin = request.nextUrl.origin;
    const customerIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    const products = normalizedItems.map((item) => ({
      name: item.name,
      unitPrice: String(item.unitPricePln * 100),
      quantity: item.quantity,
    }));

    const orderPayload = {
      notifyUrl: origin + "/api/payu/notify",
      continueUrl: origin + "/order/thank-you?order=" + encodeURIComponent(extOrderId),
      customerIp,
      merchantPosId: config.posId,
      description: "Anna Moga order " + extOrderId,
      currencyCode: "PLN",
      totalAmount: String(subtotalPln * 100),
      extOrderId,
      buyer: {
        email: customer.email,
        phone: customer.phone,
        firstName: customer.firstName,
        lastName: customer.lastName,
        language: "en",
      },
      products,
    };

    const payuResponse = await fetch(config.baseUrl + "/api/v2_1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
      body: JSON.stringify(orderPayload),
      redirect: "manual",
      cache: "no-store",
    });

    const raw = await payuResponse.text();
    let data: Record<string, unknown> = {};
    try {
      data = raw ? JSON.parse(raw) : {};
    } catch {
      data = {};
    }

    const redirectUri =
      (typeof data.redirectUri === "string" && data.redirectUri) ||
      payuResponse.headers.get("location");

    if (!redirectUri) {
      await updateDatabaseOrder(extOrderId, { payment_status: "PAYMENT_INIT_FAILED" });
      console.error("PayU order error", payuResponse.status, raw);
      return NextResponse.json(
        { error: "PayU did not return a payment redirect URL." },
        { status: 502 }
      );
    }

    const payuOrderId = typeof data.orderId === "string" ? data.orderId : null;

    await updateDatabaseOrder(extOrderId, {
      payu_order_id: payuOrderId,
      payment_status: "PENDING",
    });

    return NextResponse.json({
      redirectUri,
      orderId: payuOrderId,
      extOrderId,
      environment: config.env,
    });
  } catch (error) {
    if (extOrderId) {
      await updateDatabaseOrder(extOrderId, { payment_status: "ERROR" });
    }

    console.error("Create PayU order failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create payment." },
      { status: 500 }
    );
  }
}
