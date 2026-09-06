export class PositionService {
    constructor(supabaseClient) {
        this.supabase = supabaseClient;
    }

    async listarCargos() {
        const { data, error } = await this.supabase
            .from('positions')
            .select('id_position, position, workload')
            .order('position', { ascending: true });

        if (error) {
            throw new Error(`Erro ao carregar cargos: ${error.message}`);
        }

        return data || [];
    }
}
