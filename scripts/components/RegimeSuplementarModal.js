class RegimeSuplementarModal extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
        this.initializeEvents();
    }

    initializeEvents() {
        const tipoInputs = this.querySelectorAll('input[name="tipoRegime"]');
        const horasContainer = this.querySelector("#horasContainer");
        const horasInput = this.querySelector("#horas");

        tipoInputs.forEach(input => {
            input.addEventListener("change", () => {
                const tipoSelecionado = this.querySelector(
                    'input[name="tipoRegime"]:checked'
                ).value;

                if (tipoSelecionado === "cancelamento") {
                    horasContainer.classList.add("d-none");
                    horasInput.required = false;
                    horasInput.value = "";
                } else {
                    horasContainer.classList.remove("d-none");
                    horasInput.required = true;
                }
            });
        });

        const form = this.querySelector("form");

        form.addEventListener("submit", event => {
            event.preventDefault();

            const dados = this.getFormData();

            console.log(dados);
        });
    }

    getFormData() {
        return {
            employeeName: this.querySelector("#servidorNome").value.trim(),
            employeeRegistration: this.querySelector("#servidorMatricula").value.trim(),
            startAt: this.querySelector("#dataInicio").value,
            type: this.querySelector(
                'input[name="tipoRegime"]:checked'
            ).value,
            hours: this.querySelector("#horas").value
                ? Number(this.querySelector("#horas").value)
                : null,
            justification: this.querySelector("#justificativa").value.trim()
        };
    }

    render() {
        this.innerHTML = `
            <div
                class="modal fade"
                id="modalRegimeSuplementar"
                tabindex="-1"
                aria-labelledby="modalRegimeSuplementarTitulo"
                aria-hidden="true"
            >
                <div class="modal-dialog">
                    <div class="modal-content">

                        <div class="modal-header">
                            <h5
                                class="modal-title"
                                id="modalRegimeSuplementarTitulo"
                            >
                                Nova Solicitação Desdobramento
                            </h5>

                            <button
                                type="button"
                                class="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Fechar"
                            ></button>
                        </div>

                        <div class="modal-body">
                            <form>

                                <div class="mb-3">
                                    <label
                                        for="servidorNome"
                                        class="form-label fw-bold"
                                    >
                                        Servidor
                                    </label>

                                    <input
                                        id="servidorNome"
                                        type="text"
                                        class="form-control"
                                        placeholder="Nome completo"
                                        required
                                    >
                                </div>

                                <div class="mb-3">
                                    <label
                                        for="servidorMatricula"
                                        class="form-label fw-bold"
                                    >
                                        Matrícula
                                    </label>

                                    <input
                                        id="servidorMatricula"
                                        type="text"
                                        class="form-control"
                                        placeholder="Ex.: 7890"
                                        required
                                    >
                                </div>

                                <div class="mb-3">
                                    <label
                                        for="dataInicio"
                                        class="form-label fw-bold"
                                    >
                                        Data de início
                                    </label>

                                    <input
                                        id="dataInicio"
                                        type="date"
                                        class="form-control"
                                        required
                                    >
                                </div>

                                <fieldset class="mb-3">
                                    <legend class="form-label fw-bold">
                                        Tipo de alteração
                                    </legend>

                                    <div class="form-check form-check-inline">
                                        <input
                                            class="form-check-input"
                                            type="radio"
                                            name="tipoRegime"
                                            id="tipoAumento"
                                            value="aumento"
                                            checked
                                        >

                                        <label
                                            class="form-check-label"
                                            for="tipoAumento"
                                        >
                                            Aumento
                                        </label>
                                    </div>

                                    <div class="form-check form-check-inline">
                                        <input
                                            class="form-check-input"
                                            type="radio"
                                            name="tipoRegime"
                                            id="tipoReducao"
                                            value="reducao"
                                        >

                                        <label
                                            class="form-check-label"
                                            for="tipoReducao"
                                        >
                                            Redução
                                        </label>
                                    </div>

                                    <div class="form-check form-check-inline">
                                        <input
                                            class="form-check-input"
                                            type="radio"
                                            name="tipoRegime"
                                            id="tipoCancelamento"
                                            value="cancelamento"
                                        >

                                        <label
                                            class="form-check-label"
                                            for="tipoCancelamento"
                                        >
                                            Cancelamento
                                        </label>
                                    </div>
                                </fieldset>

                                <div class="mb-3" id="horasContainer">
                                    <label
                                        for="horas"
                                        class="form-label fw-bold"
                                    >
                                        Quantidade de horas
                                    </label>

                                    <div class="input-group">
                                        <input
                                            id="horas"
                                            type="number"
                                            min="1"
                                            class="form-control"
                                            placeholder="Ex.: 20"
                                            required
                                        >

                                        <span class="input-group-text">
                                            horas
                                        </span>
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <label
                                        for="justificativa"
                                        class="form-label fw-bold"
                                    >
                                        Justificativa
                                    </label>

                                    <textarea
                                        id="justificativa"
                                        class="form-control"
                                        rows="3"
                                        placeholder="Descreva resumidamente o motivo da alteração"
                                        required
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    class="btn btn-primary w-100"
                                >
                                    Salvar Solicitação
                                </button>

                            </form>
                        </div>

                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define("regime-suplementar-modal",RegimeSuplementarModal);