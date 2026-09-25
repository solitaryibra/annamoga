import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";

export const metadata = { title: "My Orders | Anna Moga" };

export default async function AccountOrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: orders } = await supabase
    .from("orders")
    .select("id,order_number,payment_status,order_status,subtotal_pln,created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="account-page">
      <section className="account-list-section">
        <div className="container">
          <p className="kicker blue">MY ACCOUNT</p>
          <h1>Orders.</h1>
          <div className="account-list">
            {(orders || []).map((order) => (
              <article className="account-list-card" key={order.id}>
                <div><strong>{order.order_number}</strong><span>{new Date(order.created_at).toLocaleDateString("en-GB")}</span></div>
                <div><span>Payment</span><strong>{order.payment_status}</strong></div>
                <div><span>Status</span><strong>{order.order_status}</strong></div>
                <div><span>Total</span><strong>{order.subtotal_pln} PLN</strong></div>
              </article>
            ))}
            {!orders?.length && <div className="account-empty">No orders are linked to this account yet.</div>}
          </div>
          <Link className="admin-back" href="/account">← Back to account</Link>
        </div>
      </section>
    </main>
  );
}
