import { appUrl } from '../config/appPaths.js';

class PageFooter extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
            <div class="container text-center text-muted">
                <p class="mb-1">© 2026 Sistema Quirino — Gestão escolar. Todos os direitos reservados.</p>
                <p class="mb-1">Desenvolvido por <strong>Bruno Medeiros Dias</strong></p>
                <nav class="mb-2" aria-label="Links do rodapé">
                    <a class="badge bg-danger fw-bold text-decoration-none" href="${appUrl('public/mapa-site.html')}">Mapa do site</a>
                    <span aria-hidden="true"> | </span>
                    <a class="text-muted fw-bold text-decoration-none" target="_blank" rel="noopener noreferrer" href="https://github.com/beofrid/Quirino">GitHub</a>
                </nav>
                <a href="https://www.flaticon.com/free-icons/casino-chips" style="font-size: 0.6rem;" class="text-muted text-decoration-none" title="Ícones de fichas de cassino">Casino chips icons created by Anggara — Flaticon</a>
            </div>
        `;
    }
}

customElements.define('page-footer', PageFooter);
