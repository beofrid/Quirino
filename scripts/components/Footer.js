class pageFooter extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
            <div class="container text-center text-muted">
                <p class="mb-1">© 2026 Sistema Quirino - Gestão escolar. Todos os direitos reservados.</p>
                <p class="mb-0">Desenvolvido por <strong>Bruno Medeiros Dias</strong></p>
                <p> Link do repositório <a class="text-muted fw-bold text-decoration-none" target="_blank" href="https://github.com/beofrid/Quirino">Github</a></p>
                <a href="https://www.flaticon.com/free-icons/casino-chips" style="font-size: 0.6rem;" class="text-muted text-decoration-none" title="casino chips icons">Casino chips icons created by Anggara - Flaticon</a>
            </div>
                `;
        }
    }

    customElements.define('page-footer', pageFooter);

