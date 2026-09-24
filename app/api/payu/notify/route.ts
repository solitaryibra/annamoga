import { createHash, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";

function signatureFromHeader(header: string | null) {
  if (!header) return "";
  const match = header.match(/(?:^|;)\s*signature=([^;]+)/i);
  return match?.[1]?.trim() || "";
}

function supabaseConfig() {
  return {
    url: (process.env.SUPABASE_URL || "").replace(/\/$/, ""),
    secret: process.env.SUPABASE_SECRET_KEY || "",
  };
}

async function updateOrderFromPayU(extOrderId: string, patch: Record<string, unknown>) {
  const config = supabaseConfig();
  if (!config.url || !config.secret) {
    throw new Error("Supabase is not configured.");
  }

  const response = await fetch(
    config.url + "/rest/v1/orders?payu_ext_order_id=eq." + encodeURIComponent(extOrderId),
    {
      method: "PATCH",
      headers: {
        apikey: config.secret,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ ...patch, updated_at: new Date().toISOString() }),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const detail = await response.text();
    console.error("Supabase PayU update failed", response.status, detail);
    throw new Error("Unable to update order status.");
  }
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const incoming = signatureFromHeader(
    request.headers.get("openpayu-signature") ||
    request.headers.get("x-openpayu-signature")
  );
  const secondKey = process.env.PAYU_SECOND_KEY || "";

  if (!incoming || !secondKey) {
    return new NextResponse("Missing PayU signature configuration", { status: 400 });
  }

  const expected = createHash("md5").update(rawBody + secondKey, "utf8").digest("hex");
  const incomingBuffer = Buffer.from(incoming, "utf8");
  const expectedBuffer = Buffer.from(expected, "utf8");

  const valid =
    incomingBuffer.length === expectedBuffer.length &&
    timingSafeEqual(incomingBuffer, expectedBuffer);

  if (!valid) {
    return new NextResponse("Invalid signature", { status: 401 });
  }

  try {
    const notification = JSON.parse(rawBody);
    const order = notification?.order;

    if (!order?.extOrderId || !order?.status) {
      return new NextResponse("Missing order data", { status: 400 });
    }

    await updateOrderFromPayU(order.extOrderId, {
      payu_order_id: order.orderId || null,
      payment_status: order.status,
      order_status: order.status === "COMPLETED" ? "PAID" : "NEW",
    });

    console.log("Verified PayU notification saved", {
      orderId: order.orderId,
      extOrderId: order.extOrderId,
      status: order.status,
    });

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("PayU notification handling failed", error);
    return new NextResponse("Unable to process notification", { status: 500 });
  }
}
