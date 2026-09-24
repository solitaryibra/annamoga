import { createHash, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";

function signatureFromHeader(header: string | null) {
  if (!header) return "";
  const match = header.match(/(?:^|;)\s*signature=([^;]+)/i);
  return match?.[1]?.trim() || "";
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
    console.log("Verified PayU notification", {
      orderId: order?.orderId,
      extOrderId: order?.extOrderId,
      status: order?.status,
    });

    // TODO: Persist the verified order status in a database before production launch.
    return new NextResponse("OK", { status: 200 });
  } catch {
    return new NextResponse("Invalid JSON", { status: 400 });
  }
}
