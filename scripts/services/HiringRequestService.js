export class HiringRequestService {
    constructor(supabaseClient) {
        this.supabase = supabaseClient;
    }

    async listarCargos() {
        const { data, error } = await this.supabase
            .from('positions')
            .select('id_position, position, workload')
            .order('position', { ascending: true });

        if (error) throw new Error(`Erro ao carregar cargos: ${error.message}`);
        return data || [];
    }

    async listarSolicitacoesDaEscola() {
        const { data: userData, error: userError } = await this.supabase.auth.getUser();
        const user = userData?.user;

        if (userError || !user) {
            throw new Error('Sua sessão expirou. Entre novamente para consultar as solicitações.');
        }

        const { data, error } = await this.supabase
            .from('requests')
            .select(`
                id_request,
                created_at,
                status,
                hiring_requests!inner (
                    id_hiring_request,
                    positions (
                        position
                    )
                )
            `)
            .eq('id_profile', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            throw new Error(`Erro ao carregar solicitações: ${error.message}`);
        }

        return data || [];
    }

    async criarSolicitacao(dados) {
        const { data: userData, error: userError } = await this.supabase.auth.getUser();
        const user = userData?.user;

        if (userError || !user) {
            throw new Error('Sua sessão expirou. Entre novamente para registrar a solicitação.');
        }

        const idRequest = await this.criarRequisicaoPrincipal(user.id);
            console.log('Request criada:', idRequest);

        const idHiringRequest = await this.criarDetalhesContratacao(idRequest, dados);
            console.log('Hiring request criada:', idHiringRequest);

        await this.criarHorarios(idHiringRequest, dados.horarios);
                console.log('Horários criados');

        return idRequest;
    }

    async criarRequisicaoPrincipal(userId) {
        const { data, error } = await this.supabase
            .from('requests')
            .insert([{ id_profile: userId, status: 'aguardando_pedagogico' }])
            .select('id_request')
            .single();

        if (error) throw new Error(`Erro ao criar a solicitação principal: ${error.message}`);
        return data.id_request;
    }

    async criarDetalhesContratacao(idRequest, dados) {
        const isReplacement = dados.hireReason === 'substituicao';
        const hiringRequest = {
            id_request: idRequest,
            id_position: dados.positionId,
            contract_type: dados.contractType,
            hire_reason: dados.hireReason,
            replaced_name: isReplacement ? dados.replacedName : null,
            replaced_registration: isReplacement ? dados.replacedRegistration : null,
            justification: dados.justification
        };

        const { data, error } = await this.supabase
            .from('hiring_requests')
            .insert([hiringRequest])
            .select('id_hiring_request')
            .single();

        if (error) throw new Error(`Erro ao salvar os dados da contratação: ${error.message}`);
        return data.id_hiring_request;
    }

    async criarHorarios(idHiringRequest, horarios) {
        const scheduleRows = Object.entries(horarios)
            .filter(([, hour]) => Boolean(hour))
            .map(([scheduleType, hour]) => ({
                id_hiring_request: idHiringRequest,
                schedule_type: scheduleType,
                hour
            }));

        const { error } = await this.supabase
            .from('hiring_schedules')
            .insert(scheduleRows);

        if (error) throw new Error(`Erro ao salvar os horários: ${error.message}`);
    }
}
