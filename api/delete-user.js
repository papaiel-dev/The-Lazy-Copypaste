import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }
    try {
        const supabaseAdmin = createClient(
            process.env.PUBLIC_SUPABASE_URL,
            process.env.SUPABASE_SERVICE_KEY
        );
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'Nenhum token fornecido.' });
        }
        const token = authHeader.split(' ')[1];
        const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
        if (userError || !user) {
            return res.status(401).json({ error: 'Token inválido ou expirado.' });
        }
        const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);
        if (deleteError) { throw deleteError; }
        return res.status(200).json({ message: 'Conta deletada com sucesso.' });
    } catch (error) {
        console.error('Erro ao deletar usuário:', error);
        return res.status(500).json({ error: 'Erro interno do servidor ao deletar a conta.' });
    }
}