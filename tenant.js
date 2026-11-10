// CallReady: which client database this browser is signed in to.
// The login page looks the email up in the login directory (callready-web) and remembers
// the answer here. Every other page uses CallReadyTenant.client() instead of creating its
// own Supabase client, so it talks to the right database. Anyone not found in the directory
// uses the default from config.js (Seqirus), exactly as before.
(function () {
  const cfg = window.CALLREADY;
  const KEY = "callready-tenant";
  const fallback = { tenant: cfg.defaultTenant || "seqirus", supabaseUrl: cfg.supabaseUrl, supabaseAnonKey: cfg.supabaseAnonKey };

  function read() {
    try {
      const t = JSON.parse(localStorage.getItem(KEY) || "null");
      if (t && t.supabaseUrl && t.supabaseAnonKey) return t;
    } catch (e) { /* storage blocked: use the default */ }
    return fallback;
  }

  let current = read();
  let client = null;

  window.CallReadyTenant = {
    get: () => current,
    isDemo: () => current.tenant === "demo",
    home: (t) => ((t || current).tenant === "demo" ? "demo.html" : "practice.html"),

    set(t) {
      current = t && t.supabaseUrl ? t : fallback;
      client = null;
      try { localStorage.setItem(KEY, JSON.stringify(current)); } catch (e) { /* ignore */ }
    },

    client() {
      if (!client) client = supabase.createClient(current.supabaseUrl, current.supabaseAnonKey);
      return client;
    },

    // Ask the login directory which database an email belongs to. Falls back to the default if unreachable.
    async lookup(email) {
      try {
        const res = await fetch(cfg.directoryUrl + "/rest/v1/rpc/lookup_tenant", {
          method: "POST",
          headers: { apikey: cfg.directoryKey, "content-type": "application/json" },
          body: JSON.stringify({ p_email: email })
        });
        if (res.ok) {
          const t = await res.json();
          if (t && t.supabaseUrl) return t;
        }
      } catch (e) { console.warn("Login directory unreachable; using the default", e); }
      return fallback;
    },

    async signOut() {
      try { await this.client().auth.signOut(); } catch (e) { /* ignore */ }
      try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ }
      location.replace("./");
    }
  };
})();
