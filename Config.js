// p.negociofechado - CONFIGURE AQUI
const SUPABASE_URL = "SUA_URL_SUPABASE"; // ex: https://abcd.supabase.co
const SUPABASE_ANON_KEY = "SUA_ANON_KEY";

let supabaseClient = null;
if(SUPABASE_URL.startsWith('http')){
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
