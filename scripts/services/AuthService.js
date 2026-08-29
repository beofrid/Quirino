export class AuthService {
    constructor(supabaseClient) {
        this.supabase = supabaseClient;
        this.currentUser = null;
    }

    async login(email, password) {
        const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
        if (error) throw new Error(error.message);
        
        await this.loadUserProfile(data.user.id);
        return this.currentUser;
    }

    async loadUserProfile(userId) {
        const { data, error } = await this.supabase
            .from('profiles')
            .select('role, name')
            .eq('id', userId)
            .single();
            
        if (error) throw new Error("Erro ao carregar perfil.");
        this.currentUser = { id: userId, ...data };
    }

    hasRole(expectedRole) {
        return this.currentUser?.role === expectedRole;
    }


    async getCurrentUser() {
        const { data: { user }, error } = await this.supabase.auth.getUser();
        
        if (error || !user) {
            console.warn("Usuário não autenticado:", error?.message);
            return null;
        }
        return user;
    }
}