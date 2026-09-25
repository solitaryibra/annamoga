"use client";

import { createClient } from "../lib/supabase/client";

export default function AccountLogout() {
  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return <button className="btn secondary" onClick={logout}>Sign out</button>;
}
