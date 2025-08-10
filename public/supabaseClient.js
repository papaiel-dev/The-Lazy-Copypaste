// ATENÇÃO: Cole suas chaves do Supabase diretamente aqui.
const supabaseUrl = "https://tqhgbhlotjjdpvpegxlo.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxaGdiaGxvdGpqZHB2cGVneGxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3ODM1ODksImV4cCI6MjA3MDM1OTU4OX0.Ug_1Vzu3vYSvUtCH3pOv5H4cmWr2yUIToPKt3L-blN8";

// Esta variável 'supabase' ficará disponível globalmente para outros scripts
let supabase;

try {
    // Validação simples para garantir que as chaves foram coladas
    if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes("SEU_PROJETO")) {
        throw new Error('As chaves do Supabase não foram definidas corretamente no supabaseClient.js');
    }

    // Usa a biblioteca global carregada via CDN no HTML
    const { createClient } = supabase_module; 
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    console.log('Cliente Supabase inicializado com sucesso.');

} catch (error) {
    console.error('Erro ao inicializar o Supabase:', error);
    // Este alerta é importante para o debug, se as chaves estiverem erradas.
    alert('Erro crítico na configuração do aplicativo. Verifique o console.');
}