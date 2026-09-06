class ContrataModal extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
        this.initializeTimePickers();
        this.initializeHireReasonToggle();
    }

    initializeHireReasonToggle() {
        const reasonOptions = this.querySelectorAll('input[name="tipoContratacao"]');
        const newHireOption = this.querySelector('#tipoNovo');
        const replacementFields = this.querySelector('#substituicao');
        const replacementInputs = replacementFields.querySelectorAll('input');

        const updateReplacementFields = () => {
            const isNewHire = newHireOption.checked;

            replacementFields.classList.toggle('d-none', isNewHire);
            replacementFields.setAttribute('aria-hidden', String(isNewHire));
            replacementInputs.forEach((input) => {
                input.disabled = isNewHire;
                input.required = !isNewHire;
            });
        };

        reasonOptions.forEach((option) => {
            option.addEventListener('change', updateReplacementFields);
        });
        updateReplacementFields();
    }

    initializeTimePickers() {
        if (typeof flatpickr !== 'function') {
            console.error('Flatpickr não foi carregado.');
            return;
        }

        flatpickr(this.querySelectorAll('.time-picker'), {
            enableTime: true,
            noCalendar: true,
            dateFormat: 'H:i',
            time_24hr: true,
            minuteIncrement: 5
        });
    }

    render() {
        this.innerHTML = `
            <div class="modal fade" id="modalSolicitacao" tabindex="-1" aria-labelledby="modalSolicitacaoTitulo" aria-hidden="true">
                <div class="modal-dialog modal-dialog-scrollable">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h2 class="modal-title fs-5" id="modalSolicitacaoTitulo">Nova solicitação</h2>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                        </div>

                        <div class="modal-body">
                            <form id="hiringRequestForm">
                                <div class="mb-3">
                                    <label for="cargoSelect" class="form-label fw-bold">Cargo desejado</label>
                                    <select class="form-select" id="cargoSelect" required>
                                        <option value="" selected disabled>Carregando cargos...</option>
                                    </select>
                                </div>

                                <div class="mb-3">
                                    <label for="contractTypeSelect" class="form-label fw-bold">Tipo de vínculo</label>
                                    <select class="form-select" id="contractTypeSelect" required>
                                        <option value="" selected disabled>Selecione o tipo</option>
                                        <option value="contratacao">Contratação</option>
                                        <option value="nomeacao">Nomeação</option>
                                    </select>
                                    <div id="internRestrictionMessage" class="form-text text-primary d-none">
                                        Para o cargo de estagiário, o tipo de vínculo é contratação.
                                    </div>
                                </div>

                                <fieldset class="mb-3">
                                    <legend class="form-label fw-bold fs-6">Horário de atuação</legend>
                                    <div class="row g-2">
                                        <div class="col-6">
                                            <label for="entrada1" class="form-label small">Entrada 1</label>
                                            <input type="text" id="entrada1" class="form-control time-picker" placeholder="08:00" required>
                                        </div>
                                        <div class="col-6">
                                            <label for="saida1" class="form-label small">Saída 1</label>
                                            <input type="text" id="saida1" class="form-control time-picker" placeholder="12:00" required>
                                        </div>
                                        <div class="col-6">
                                            <label for="entrada2" class="form-label small">Entrada 2</label>
                                            <input type="text" id="entrada2" class="form-control time-picker" placeholder="13:30">
                                        </div>
                                        <div class="col-6">
                                            <label for="saida2" class="form-label small">Saída 2</label>
                                            <input type="text" id="saida2" class="form-control time-picker" placeholder="17:30">
                                        </div>
                                    </div>
                                </fieldset>

                                <fieldset class="mb-3">
                                    <legend class="form-label fw-bold fs-6">Motivo da contratação</legend>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" name="tipoContratacao" id="tipoSubstituicao" value="substituicao" checked>
                                        <label class="form-check-label" for="tipoSubstituicao">Substituição</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" name="tipoContratacao" id="tipoNovo" value="nova_contratacao">
                                        <label class="form-check-label" for="tipoNovo">Nova contratação</label>
                                    </div>
                                </fieldset>

                                <div id="substituicao" class="mb-3">
                                    <label for="sName" class="form-label fw-bold">Servidor substituído</label>
                                    <input id="sName" type="text" class="form-control" placeholder="Nome completo">

                                    <label for="sId" class="form-label fw-bold mt-3">Matrícula</label>
                                    <input id="sId" type="text" class="form-control" placeholder="Ex.: 7890">
                                </div>

                                <div class="mb-3">
                                    <label for="observacaoTextarea" class="form-label fw-bold">Justificativa</label>
                                    <textarea id="observacaoTextarea" class="form-control" rows="3" placeholder="Descreva resumidamente (não identificar aluno)" required></textarea>
                                </div>

                                <button id="saveHiringRequest" type="submit" class="btn btn-primary w-100">
                                    Salvar solicitação
                                </button>
                                <div id="hiringRequestFeedback" class="alert d-none mt-3 mb-0" role="status" aria-live="polite"></div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('contrata-modal', ContrataModal);
