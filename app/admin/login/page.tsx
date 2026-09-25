export const metadata = {
  title: "Admin Login | Anna Moga",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const error =
    params.error === "invalid"
      ? "Incorrect password."
      : params.error === "not-configured"
        ? "ADMIN_PASSWORD has not been configured in Vercel yet."
        : "";

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <p className="kicker blue">ANNA MOGA ADMIN</p>
        <h1>Orders,<br/><span>on your phone.</span></h1>
        <p className="admin-login-copy">Sign in to view customer orders and payment status.</p>

        <form action="/api/admin/login" method="post" className="admin-login-form">
          <label>
            <span>Password</span>
            <input type="password" name="password" autoComplete="current-password" required />
          </label>
          <button className="btn primary" type="submit">Sign in</button>
        </form>

        {error && <p className="payment-error">{error}</p>}
      </section>
    </main>
  );
}
