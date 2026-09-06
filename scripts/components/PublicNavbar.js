import { NavbarController } from '../controllers/NavbarController.js';
import { appUrl } from '../config/appPaths.js';

class PublicNavbar extends HTMLElement {
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
                        <a class="navbar-brand" href="${appUrl('public/sobre.html')}"><img src="${appUrl('src/icon.png')}" style="width: 40px;" alt="ficha de poker"> <span class="mystery-quest fw-bold">Quirino</span></a>
                        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
                             <ul class="navbar-nav me-auto">
                                <li class="nav-item">
                                    <a class="nav-link fw-bold" href="${appUrl('public/ferias.html')}">Férias</a>
                                </li>
                                <li class="nav-item">   
                                    <a class="nav-link" href="${appUrl('public/sobre.html')}">Sobre</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="${appUrl('public/ajuda.html')}">Ajuda</a>
                                </li>
                                <li class="nav-item">
                                    <a id="painelTrabalhoLink" class="nav-link" href="${appUrl('index.html')}">Painel de trabalho</a>
                                </li>
                            </ul>    

                            <span class="navbar-text ">
                                <span id="userEmailDisplay" class="badge bg-secondary rounded-pill fw-normal" aria-live="polite">
                                    Carregando...
                                </span> | 
                                <a class="text-secondary text-decoration-none" href="${appUrl('index.html')}" id="sessionAction">Carregando...</a>
                            </span>
                        </div>
                    </div>
                </nav>
                `;
        }
    }

customElements.define('public-navbar', PublicNavbar);
