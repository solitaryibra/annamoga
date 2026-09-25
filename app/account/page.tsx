import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import AccountLogout from "../../components/AccountLogout";

export const metadata = { title: "My Account | Anna Moga" };

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { count: orderCount }, { count: deviceCount }] = await Promise.all([
    supabase.from("profiles").select("first_name,last_name,phone").eq("user_id", user.id).maybeSingle(),
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("devices").select("id", { count: "exact", head: true }).eq("user_id", user.id),
  ]);

  const name = [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || user.email || "Customer";

  return (
    <main className="account-page">
      <section className="account-hero">
        <div className="container account-hero-inner">
          <div>
            <p className="kicker blue">MY ANNA MOGA</p>
            <h1>Hello, {name}.</h1>
            <p>Manage your orders, devices and personalized hardware settings.</p>
          </div>
          <AccountLogout />
        </div>
      </section>

      <section className="account-content">
        <div className="container">
          <div className="account-grid">
            <Link href="/account/orders" className="account-card">
              <span>Orders</span>
              <strong>{orderCount ?? 0}</strong>
              <p>View purchases and payment status.</p>
            </Link>
            <Link href="/account/devices" className="account-card">
              <span>Devices</span>
              <strong>{deviceCount ?? 0}</strong>
              <p>Manage your figurines and hardware settings.</p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
