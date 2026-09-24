import { NextRequest, NextResponse } from "next/server";

type CheckoutItem = {
  name?: string;
  quantity?: number;
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

export async function POST(request: NextRequest) {
  try {
    const { items, customer } = await request.json() as {
      items: CheckoutItem[];
      customer: Record<string, string>;
    };

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    }

    if (!customer?.email || !customer?.firstName || !customer?.lastName || !customer?.phone) {
      return NextResponse.json({ error: "Customer details are incomplete." }, { status: 400 });
    }

    const products = items.map((item) => {
      const unitPricePln = PRICE_MAP[item.name || ""];
      if (!unitPricePln) throw new Error("Unknown product in cart.");
      const quantity = Math.max(1, Math.min(20, Number(item.quantity) || 1));
      return {
        name: item.name,
        unitPrice: String(unitPricePln * 100),
        quantity,
      };
    });

    const totalAmount = products.reduce(
      (sum, product) => sum + Number(product.unitPrice) * product.quantity,
      0
    );

    const config = payuConfig();
    if (!config.clientId || !config.clientSecret || !config.posId) {
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

    const extOrderId = "AM-" + Date.now() + "-" + crypto.randomUUID().slice(0, 8);

    const orderPayload = {
      notifyUrl: origin + "/api/payu/notify",
      continueUrl: origin + "/order/thank-you?order=" + encodeURIComponent(extOrderId),
      customerIp,
      merchantPosId: config.posId,
      description: "Anna Moga order " + extOrderId,
      currencyCode: "PLN",
      totalAmount: String(totalAmount),
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
      console.error("PayU order error", payuResponse.status, raw);
      return NextResponse.json(
        { error: "PayU did not return a payment redirect URL." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      redirectUri,
      orderId: typeof data.orderId === "string" ? data.orderId : null,
      extOrderId,
      environment: config.env,
    });
  } catch (error) {
    console.error("Create PayU order failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create payment." },
      { status: 500 }
    );
  }
}
