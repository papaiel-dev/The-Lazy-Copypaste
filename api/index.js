// Esta função será executada nos servidores da Vercel
export default function handler(request, response) {
  // Pega as variáveis de ambiente configuradas na Vercel
  const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

  // Envia as chaves como resposta em formato JSON
  response.status(200).json({
    supabaseUrl,
    supabaseAnonKey,
  });
}