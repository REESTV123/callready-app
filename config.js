// CallReady app settings.
// The anon/publishable keys are designed to be public: they only allow what each database's security rules allow.
// Never put a service role or secret key here.
window.CALLREADY = {
  // Default client database (Seqirus): used for any email not in the login directory.
  defaultTenant: "seqirus",
  supabaseUrl: "https://krznsssslgfvxxrzjlkh.supabase.co",
  supabaseAnonKey: "sb_publishable_uu8ItpqzEu_Gyo1rFWfwZw_Rnk3Kdw7",

  // Login directory (callready-web): which client database each email belongs to.
  directoryUrl: "https://nyylhoopnfnjmyoncsea.supabase.co",
  directoryKey: "sb_publishable_aqVf9wWqepxGtHnzTq99Tg_7m3nIdDk",

  apiBase: "https://api.callready.com.au",

  // Demo: where "Book a demo" buttons go.
  bookDemoUrl: "mailto:matthew@reestv.com?subject=Book%20a%20CallReady%20demo"
};
