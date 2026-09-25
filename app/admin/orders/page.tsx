import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "../../../lib/adminAuth";

type OrderRow = {
  id: number;
  order_number: string;
  payment_status: string;
  order_status: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  subtotal_pln: number;
  created_at: string;
};

type OrderItemRow = {
  id: number;
  order_id: number;
  product: string;
  personalization: string;
  stock_design: number | null;
  photo_path: string | null;
  quantity: number;
  unit_price_pln: number;
};

async function supabaseGet(path: string) {
  const url = (process.env.SUPABASE_URL || "").replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
  const key = process.env.SUPABASE_SECRET_KEY || "";
  if (!url || !key) throw new Error("Supabase environment variables are missing.");

  const response = await fetch(url + "/rest/v1/" + path, {
    headers: { apikey: key },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Supabase request failed (" + response.status + ").");
  }

  return response.json();
}

export const metadata = {
  title: "Orders | Anna Moga Admin",
};

export default async function AdminOrdersPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const [orders, items] = await Promise.all([
    supabaseGet("orders?select=id,order_number,payment_status,order_status,first_name,last_name,email,phone,city,country,subtotal_pln,created_at&order=created_at.desc&limit=100") as Promise<OrderRow[]>,
    supabaseGet("order_items?select=id,order_id,product,personalization,stock_design,photo_path,quantity,unit_price_pln&limit=500") as Promise<OrderItemRow[]>,
  ]);

  const paidCount = orders.filter((order) => order.payment_status === "COMPLETED" || order.order_status === "PAID").length;
  const pendingCount = orders.filter((order) => order.payment_status !== "COMPLETED" && order.order_status !== "PAID").length;

  return (
    <main className="admin-page">
      <section className="admin-header">
        <div className="container admin-header-inner">
          <div>
            <p className="kicker blue">ANNA MOGA ADMIN</p>
            <h1>Orders.</h1>
            <p>Latest 100 orders from your Supabase database.</p>
          </div>
          <form action="/api/admin/logout" method="post">
            <button className="btn secondary" type="submit">Log out</button>
          </form>
        </div>
      </section>

      <section className="admin-content">
        <div className="container">
          <div className="admin-stats">
            <div><span>Total</span><strong>{orders.length}</strong></div>
            <div><span>Paid</span><strong>{paidCount}</strong></div>
            <div><span>Pending / other</span><strong>{pendingCount}</strong></div>
          </div>

          <div className="admin-orders">
            {orders.length === 0 && <div className="admin-empty">No orders yet.</div>}

            {orders.map((order) => {
              const orderItems = items.filter((item) => item.order_id === order.id);
              return (
                <article className="admin-order-card" key={order.id}>
                  <div className="admin-order-top">
                    <div>
                      <p className="kicker blue">{order.order_number}</p>
                      <h2>{order.first_name} {order.last_name}</h2>
                    </div>
                    <div className="admin-order-price">{order.subtotal_pln} PLN</div>
                  </div>

                  <div className="admin-status-row">
                    <span className={"admin-status " + (order.payment_status === "COMPLETED" ? "good" : "")}>
                      Payment: {order.payment_status || "—"}
                    </span>
                    <span className={"admin-status " + (order.order_status === "PAID" ? "good" : "")}>
                      Order: {order.order_status || "—"}
                    </span>
                  </div>

                  <div className="admin-items">
                    {orderItems.map((item) => (
                      <div key={item.id}>
                        <strong>{item.quantity} × {item.product}</strong>
                        <span>
                          {item.personalization === "custom"
                            ? "Custom face"
                            : "Stock design" + (item.stock_design ? " #" + item.stock_design : "")}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="admin-order-meta">
                    <div><span>Email</span><strong>{order.email}</strong></div>
                    <div><span>Phone</span><strong>{order.phone}</strong></div>
                    <div><span>Location</span><strong>{order.city}, {order.country}</strong></div>
                    <div><span>Created</span><strong>{new Date(order.created_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}</strong></div>
                  </div>
                </article>
              );
            })}
          </div>

          <Link href="/" className="admin-back">← Back to website</Link>
        </div>
      </section>
    </main>
  );
}
