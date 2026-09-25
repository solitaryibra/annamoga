import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";

export const metadata = { title: "My Devices | Anna Moga" };

export default async function AccountDevicesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: devices } = await supabase
    .from("devices")
    .select("id,device_name,product_type,status,serial_number,firmware_version,last_seen")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="account-page">
      <section className="account-list-section">
        <div className="container">
          <p className="kicker blue">MY ACCOUNT</p>
          <h1>Devices.</h1>
          <div className="account-list">
            {(devices || []).map((device) => (
              <article className="account-device-card" key={device.id}>
                <div>
                  <span className="kicker blue">{device.product_type}</span>
                  <h2>{device.device_name || "My Anna Moga"}</h2>
                  <p>Serial: {device.serial_number}</p>
                </div>
                <div className="admin-status-row">
                  <span className="admin-status">{device.status}</span>
                  {device.firmware_version && <span className="admin-status">FW {device.firmware_version}</span>}
                </div>
              </article>
            ))}
            {!devices?.length && <div className="account-empty">No devices are linked to this account yet.</div>}
          </div>
          <Link className="admin-back" href="/account">← Back to account</Link>
        </div>
      </section>
    </main>
  );
}
