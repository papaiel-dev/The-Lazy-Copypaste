export default function handler(request, response) {
  const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.PUBLIC_SUPABASE_ANON_KEY;
  response.status(200).json({
    supabaseUrl,
    supabaseAnonKey,
  });
}