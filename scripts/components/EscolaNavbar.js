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
            <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm mb-4">
                    <div class="container">
                        <a class="navbar-brand" href="/public/sobre.html"><img src="/src/icon.png" style="width: 40px;" alt="ficha de poker"> <span class="mystery-quest fw-bold">Quirino</span></a>
                        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        <div class="collapse navbar-collapse" id="navbarNav">
                            <ul class="navbar-nav me-auto">
                                <li class="nav-item">
                                    <a class="nav-link" href="escola.html">Contratação</a>
                                </li>
                                <li class="nav-item">   
                                    <a class="nav-link" href="pedagogico.html">Desdobramento</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="rh.html">Férias</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="../index.html">Ajuda</a>
                                </li>
                            </ul>
                            <span class="navbar-text">
                                <span id="userEmailDisplay" class="badge bg-secondary rounded-pill fw-normal" aria-live="polite">
                                    Carregando...
                                </span> | 
                                <a class="text-danger text-decoration-none" href="#" id="sair">Sair</a>
                            </span>
                        </div>
                    </div>
                </nav>
                `;
        }
    }

customElements.define('escola-navbar', EscolaNavbar);
    
