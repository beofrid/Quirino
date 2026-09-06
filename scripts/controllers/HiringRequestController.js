import { supabase } from '../config/supabase.js';
import { HiringRequestService } from '../services/HiringRequestService.js';

class HiringRequestController {
    constructor() {
        this.service = new HiringRequestService(supabase);
        this.statusClasses = Object.freeze({
            pendente: 'text-bg-secondary',
            aguardando_pedagogico: 'text-bg-secondary',
            aprovado_pedagogico: 'text-bg-primary',
            recusado: 'text-bg-danger',
            encaminhado_rh: 'text-bg-info',
            rejeitado: 'text-bg-danger',
            aprovado_comissao: 'text-bg-primary',
            em_contratacao: 'text-bg-warning',
            contratado: 'text-bg-success',
            suspenso: 'text-bg-dark'
        });
    }

    async init() {
        await customElements.whenDefined('contrata-modal');

        this.form = document.querySelector('contrata-modal #hiringRequestForm');
        this.requestsTableBody = document.getElementById('lista-solicitacoes');
        if (!this.form || !this.requestsTableBody) return;

        this.positionSelect = this.form.querySelector('#cargoSelect');
        this.contractTypeSelect = this.form.querySelector('#contractTypeSelect');
        this.internMessage = this.form.querySelector('#internRestrictionMessage');
        this.feedback = this.form.querySelector('#hiringRequestFeedback');
        this.submitButton = this.form.querySelector('#saveHiringRequest');

        this.form.addEventListener('submit', (event) => this.handleSubmit(event));
        this.positionSelect.addEventListener('change', () => this.updateContractTypeRestriction());

        await Promise.all([this.loadPositions(), this.loadRequests()]);
    }

    async loadPositions() {
        this.positionSelect.disabled = true;

        try {
            this.renderPositions(await this.service.listarCargos());
        } catch (error) {
            console.error('Erro ao buscar cargos:', error);
            this.showFeedback(error.message, 'danger');
            this.positionSelect.innerHTML = '<option value="">Não foi possível carregar os cargos</option>';
        } finally {
            if (this.positionSelect.options.length > 1) this.positionSelect.disabled = false;
        }
    }

    renderPositions(positions) {
        this.positionSelect.replaceChildren();

        const placeholder = document.createElement('option');
        placeholder.value = '';
        placeholder.textContent = positions.length ? 'Selecione o cargo' : 'Nenhum cargo cadastrado';
        placeholder.disabled = true;
        placeholder.selected = true;
        this.positionSelect.appendChild(placeholder);

        positions.forEach((position) => {
            const option = document.createElement('option');
            option.value = position.id_position;
            option.dataset.positionName = position.position;
            option.textContent = position.position;
            this.positionSelect.appendChild(option);
        });

        this.positionSelect.disabled = positions.length === 0;
    }

    async loadRequests() {
        this.renderRequestsMessage('Carregando solicitações...');

        try {
            this.renderRequests(await this.service.listarSolicitacoesDaEscola());
        } catch (error) {
            console.error('Erro ao listar solicitações:', error);
            this.renderRequestsMessage(error.message || 'Não foi possível carregar as solicitações.', 'text-danger');
        }
    }

    renderRequests(requests) {
        this.requestsTableBody.replaceChildren();

        if (requests.length === 0) {
            this.renderRequestsMessage('Nenhuma solicitação de contratação cadastrada.');
            return;
        }

        const fragment = document.createDocumentFragment();
        requests.forEach((request) => fragment.appendChild(this.createRequestRow(request)));
        this.requestsTableBody.appendChild(fragment);
    }

    createRequestRow(request) {
        const hiringDetails = Array.isArray(request.hiring_requests)
            ? request.hiring_requests[0]
            : request.hiring_requests;
        const position = Array.isArray(hiringDetails?.positions)
            ? hiringDetails.positions[0]
            : hiringDetails?.positions;

        const row = document.createElement('tr');
        const idCell = document.createElement('td');
        const positionCell = document.createElement('td');
        const dateCell = document.createElement('td');
        const statusCell = document.createElement('td');
        const actionsCell = document.createElement('td');
        const statusBadge = document.createElement('span');
        const viewButton = document.createElement('button');

        idCell.textContent = request.id_request;
        positionCell.textContent = position?.position || 'Cargo não informado';
        dateCell.textContent = this.formatDate(request.created_at);
        statusBadge.className = `badge ${this.statusClasses[request.status] || 'text-bg-light'}`;
        statusBadge.textContent = this.formatStatus(request.status);
        statusCell.appendChild(statusBadge);
        viewButton.type = 'button';
        viewButton.className = 'btn btn-sm btn-outline-info';
        viewButton.textContent = 'Ver';
        viewButton.disabled = true;
        viewButton.title = 'Visualização detalhada ainda não implementada';
        viewButton.setAttribute('aria-label', `Ver solicitação ${request.id_request} — ainda não implementado`);
        actionsCell.appendChild(viewButton);
        row.append(idCell, positionCell, dateCell, statusCell, actionsCell);
        return row;
    }

    renderRequestsMessage(message, className = 'text-secondary') {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 5;
        cell.className = `text-center py-4 ${className}`;
        cell.textContent = message;
        row.appendChild(cell);
        this.requestsTableBody.replaceChildren(row);
    }

    formatDate(value) {
        if (!value) return '—';
        return new Intl.DateTimeFormat('pt-BR').format(new Date(value));
    }

    formatStatus(status) {
        if (!status) return 'Não informado';
        return status.replaceAll('_', ' ');
    }

    updateContractTypeRestriction() {
        const positionName = this.positionSelect.selectedOptions[0]?.dataset.positionName || '';
        const normalizedName = positionName
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase();
        const isIntern = normalizedName.includes('estagiario');

        if (isIntern) this.contractTypeSelect.value = 'contratacao';
        this.contractTypeSelect.disabled = isIntern;
        this.internMessage.classList.toggle('d-none', !isIntern);
    }

    async handleSubmit(event) {
        event.preventDefault();
        if (!this.validateSecondSchedule()) return;

        this.setLoading(true);
        this.showFeedback('Registrando solicitação...', 'info');

        try {
            const idRequest = await this.service.criarSolicitacao(this.collectFormData());
            await this.loadRequests();
            this.showFeedback(`Solicitação nº ${idRequest} registrada com sucesso!`, 'success');
            this.form.reset();
            this.form.querySelector('#tipoSubstituicao').dispatchEvent(new Event('change'));
            this.updateContractTypeRestriction();
            this.closeModalAfterSuccess();
        } catch (error) {
            console.error('Erro ao registrar solicitação:', error);
            this.showFeedback(error.message || 'Não foi possível registrar a solicitação.', 'danger');
        } finally {
            this.setLoading(false);
        }
    }

    validateSecondSchedule() {
        const entry = this.form.querySelector('#entrada2');
        const exit = this.form.querySelector('#saida2');
        const onlyOneFilled = Boolean(entry.value) !== Boolean(exit.value);
        entry.setCustomValidity(onlyOneFilled ? 'Informe também a saída do segundo turno.' : '');
        exit.setCustomValidity(onlyOneFilled ? 'Informe também a entrada do segundo turno.' : '');
        if (onlyOneFilled) this.form.reportValidity();
        return !onlyOneFilled;
    }

    collectFormData() {
        return {
            positionId: Number(this.positionSelect.value),
            contractType: this.contractTypeSelect.value,
            hireReason: this.form.querySelector('input[name="tipoContratacao"]:checked').value,
            replacedName: this.form.querySelector('#sName').value.trim(),
            replacedRegistration: this.form.querySelector('#sId').value.trim(),
            justification: this.form.querySelector('#observacaoTextarea').value.trim(),
            horarios: {
                entrada_1: this.form.querySelector('#entrada1').value,
                saida_1: this.form.querySelector('#saida1').value,
                entrada_2: this.form.querySelector('#entrada2').value,
                saida_2: this.form.querySelector('#saida2').value
            }
        };
    }

    showFeedback(message, type) {
        this.feedback.textContent = message;
        this.feedback.className = `alert alert-${type} mt-3 mb-0`;
    }

    setLoading(loading) {
        this.submitButton.disabled = loading;
        this.submitButton.textContent = loading ? 'Salvando...' : 'Salvar solicitação';
    }

    closeModalAfterSuccess() {
        setTimeout(() => {
            const modalElement = document.getElementById('modalSolicitacao');
            window.bootstrap?.Modal.getOrCreateInstance(modalElement).hide();
        }, 1200);
    }
}

new HiringRequestController().init();
