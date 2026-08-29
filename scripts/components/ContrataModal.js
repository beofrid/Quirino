class ContrataModal extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
        this.initializeTimePickers();
    }

    initializeTimePickers() {
        if (typeof flatpickr !== "function") {
            console.error("Flatpickr não foi carregado.");
            return;
        }

        flatpickr(this.querySelectorAll(".time-picker"), {
            enableTime: true,
            noCalendar: true,
            dateFormat: "H:i",
            time_24hr: true,
            minuteIncrement: 5
        });
    }

    render() {
        this.innerHTML = `
            <div class="modal fade" id="modalSolicitacao" tabindex="-1" aria-labelledby="modalSolicitacaoTitulo" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="modalSolicitacaoTitulo">Nova Solicitação</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                        </div>
                        <div class="modal-body">
                            <form>
                                <div class="mb-3">
                                    <label class="form-label fw-bold">Cargo Desejado</label>
                                    <select class="form-select" id="cargoSelect" required>
                                        <option value="" selected disabled>Selecione o cargo</option>
                                    </select>
                                    
                                    <label class="form-label fw-bold pt-3">Horário de atuação</label>
                                    <div class="row g-2">
                                        <div class="col-6">
                                            <input type="text" id="entrada1" class="form-control time-picker" placeholder="Entrada 1 (ex: 08:00)">
                                        </div>
                                        <div class="col-6">
                                            <input type="text" id="saida1" class="form-control time-picker" placeholder="Saída 1 (ex: 12:00)">
                                        </div>
                                        <div class="col-6">
                                            <input type="text" id="entrada2" class="form-control time-picker" placeholder="Entrada 2 (ex: 13:30)">
                                        </div>
                                        <div class="col-6">
                                            <input type="text" id="saida2" class="form-control time-picker" placeholder="Saída 2 (ex: 17:30)">
                                        </div>
                                    </div>

                                    <label class="form-label fw-bold pt-3">Tipo de Contratação</label>
                                    <div>
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="radio" name="tipoContratacao" id="tipoSubstituicao" value="substituicao" checked>
                                            <label class="form-check-label" for="tipoSubstituicao">Substituição</label>
                                        </div>
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="radio" name="tipoContratacao" id="tipoNovo" value="aumento">
                                            <label class="form-check-label" for="tipoNovo">Nova contratação</label>
                                        </div>
                                    </div>
                                    
                                    <div id="substituicao">
                                        <label class="form-label fw-bold pt-3">Servidor substituido</label>
                                        <input id="sName" type="text" class="form-control" placeholder="Nome completo" >
                                        <label class="form-label fw-bold pt-3">Matrícula</label>
                                        <input id="sId" type="number" class="form-control" placeholder="Ex.: 7890 " >
                                    </div>
                                    
                                    <div id="contratacao">
                                        <label class="form-label fw-bold pt-3">Justificativa</label>
                                        <textarea id="observacaoTextarea" class="form-control" rows="3" placeholder="Descreva resumidamente (não identificar aluno)" ></textarea>
                                    </div>
                                </div>
                                <button type="submit" class="btn btn-primary w-100">Salvar Solicitação</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
                `;
    }
}

customElements.define("contrata-modal", ContrataModal);
