import { NavbarController } from '../controllers/NavbarController.js';

class EscolaNavbar extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
        this.controller = new NavbarController(this);
    }

    render() {
        this.innerHTML = `
            <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm mb-4" aria-label="Navegação da escola">
                <div class="container">
                    <a class="navbar-brand" href="/public/sobre.html">
                        <img src="/src/icon.png" style="width: 40px;" alt="">
                        <span class="mystery-quest fw-bold">Quirino</span>
                    </a>

                    <button
                        class="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarEscola"
                        aria-controls="navbarEscola"
                        aria-expanded="false"
                        aria-label="Abrir ou fechar menu de navegação"
                    >
                        <span class="navbar-toggler-icon"></span>
                    </button>

                    <div class="collapse navbar-collapse" id="navbarEscola">
                        <ul class="navbar-nav me-auto">
                            <li class="nav-item">
                                <a class="nav-link" href="/protected/escola/contrata.html">Contratação</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="/protected/escola/desdobramento.html">Desdobramento</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="/public/ferias.html">Férias</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="/public/ajuda.html">Ajuda</a>
                            </li>
                        </ul>

                        <span class="navbar-text">
                            <span id="userEmailDisplay" class="badge bg-secondary rounded-pill fw-normal" aria-live="polite">
                                Carregando...
                            </span>
                            <span aria-hidden="true"> | </span>
                            <a class="text-secondary text-decoration-none" href="/index.html" id="sessionAction">
                                Carregando...
                            </a>
                        </span>
                    </div>
                </div>
            </nav>
        `;
    }
}

customElements.define('escola-navbar', EscolaNavbar);
