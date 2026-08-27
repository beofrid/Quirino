import { supabase } from './config/supabase.js';

export class AuthManager {
    constructor(client) {
        this.supabase = client;
        this.session = null;
        this.initSessionListener();
    }

    initSessionListener() {
        // Escuta ativamente o status da sessão do usuário
        this.supabase.auth.onAuthStateChange((event, session) => {
            this.session = session;
            if (event === 'SIGNED_OUT') {
                window.location.href = '/login.html';
            }
        });
    }

    async login(email, password) {
        const { data: authData, error: authError } = await this.supabase.auth.signInWithPassword({
            email,
            password
        });
        
        if (authError) throw new Error("Credenciais inválidas ou usuário não encontrado.");

        return await this.getUserProfile(authData.user.id);
    }

    async getUserProfile(userId) {
        const { data, error } = await this.supabase
            .from('profiles')
            .select('role, name')
            .eq('id', userId)
            .single();

        if (error) throw new Error("Erro ao consultar os privilégios do perfil.");
        return data; 
    }
}