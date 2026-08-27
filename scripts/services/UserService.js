export class UserService {
    constructor(supabaseClient) {
        this.supabase = supabaseClient;
    }

    async criarUsuario(email, password, role, nomeSetor) {
        // 1. Cria o usuário na tabela de autenticação
        const { data: authData, error: authError } = await this.supabase.auth.signUp({
            email,
            password
        });

        if (authError) throw new Error(`Erro na autenticação: ${authError.message}`);
        
        const userId = authData.user.id;

        // 2. Insere a role e o setor na tabela de perfis
        const { error: profileError } = await this.supabase
            .from('profiles')
            .insert([{ id: userId, role: role, name: nomeSetor }]);

        if (profileError) throw new Error(`Erro ao salvar perfil: ${profileError.message}`);

        return authData.user;
    }
}