export class UserService {
    constructor(supabaseClient) {
        this.supabase = supabaseClient;
    }

    async criarUsuario(email, password, role, nomeSetor) {
        const { data: authData, error: authError } = await this.supabase.auth.signUp({
            email,
            password
        });

        if (authError) {
            throw new Error(`Erro na autenticação: ${authError.message}`);
        }

        if (!authData.user) {
            throw new Error('O Supabase não retornou os dados do novo usuário.');
        }

        const { error: profileError } = await this.supabase
            .from('profiles')
            .insert([{ id: authData.user.id, role, name: nomeSetor }]);

        if (profileError) {
            throw new Error(`Erro ao salvar perfil: ${profileError.message}`);
        }

        return authData.user;
    }

    async listarUsuarios() {
        const { data, error } = await this.supabase
            .from('profiles')
            .select('id, name, role')
            .order('name', { ascending: true });

        if (error) {
            throw new Error(`Erro ao carregar usuários: ${error.message}`);
        }

        return data || [];
    }
}
