let supabase;

(async () => {
    try {
        const response = await fetch('/api/config');
        if (!response.ok) throw new Error('Falha ao buscar configuração do servidor.');
        const config = await response.json();
        if (!config.supabaseUrl || !config.supabaseAnonKey) {
            return console.error('URL ou chave anônima do Supabase não foram encontradas.');
        }
        const { createClient } = supabase_module;
        supabase = createClient(config.supabaseUrl, config.supabaseAnonKey);
        console.log('Cliente Supabase inicializado.');
    } catch (error) {
        console.error('Erro ao inicializar o Supabase:', error);
    }
})();