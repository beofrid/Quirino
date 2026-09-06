import { supabase } from '../config/supabase.js';
import { HiringRequestService } from '../services/HiringRequestService.js';

class HiringRequestController {
    constructor() {
        this.service = new HiringRequestService(supabase);
    }

    async init() {
        await customElements.whenDefined('contrata-modal');

        this.form = document.querySelector('contrata-modal #hiringRequestForm');
        if (!this.form) return;

        this.positionSelect = this.form.querySelector('#cargoSelect');
        this.contractTypeSelect = this.form.querySelector('#contractTypeSelect');
        this.internMessage = this.form.querySelector('#internRestrictionMessage');
        this.feedback = this.form.querySelector('#hiringRequestFeedback');
        this.submitButton = this.form.querySelector('#saveHiringRequest');

        this.form.addEventListener('submit', (event) => this.handleSubmit(event));
        this.positionSelect.addEventListener('change', () => this.updateContractTypeRestriction());
        await this.loadPositions();
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
            option.textContent = `${position.position}`;
            this.positionSelect.appendChild(option);
        });

        this.positionSelect.disabled = positions.length === 0;
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
