import { NavbarController } from '../controllers/NavbarController.js';

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
                        <a class="navbar-brand" href="/public/sobre.html"><img src="/src/icon.png" style="width: 40px;" alt="ficha de poker"> <span class="mystery-quest fw-bold">Quirino</span></a>
                        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
                             <ul class="navbar-nav me-auto">
                                <li class="nav-item">
                                    <a class="nav-link fw-bold" href="/public/ferias.html">Férias</a>
                                </li>
                                <li class="nav-item">   
                                    <a class="nav-link" href="/public/sobre.html">Sobre</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="/public/ajuda.html">Ajuda</a>
                                </li>
                                <li class="nav-item">
                                    <a id="painelTrabalhoLink" class="nav-link" href="/index.html">Painel de trabalho</a>
                                </li>
                            </ul>    

                            <span class="navbar-text ">
                                <span id="userEmailDisplay" class="badge bg-secondary rounded-pill fw-normal" aria-live="polite">
                                    Carregando...
                                </span> | 
                                <a class="text-secondary text-decoration-none" href="/index.html" id="sessionAction">Carregando...</a>
                            </span>
                        </div>
                    </div>
                </nav>
                `;
        }
    }

customElements.define('public-navbar', PublicNavbar);
    


    //    <ul class="navbar-nav me-auto">
    //                             <li class="nav-item">
    //                                 <a class="nav-link" href="escola.html">Contratação</a>
    //                             </li>
    //                             <li class="nav-item">   
    //                                 <a class="nav-link" href="pedagogico.html">Desdobramento</a>
    //                             </li>
    //                             <li class="nav-item">
    //                                 <a class="nav-link" href="rh.html">Férias</a>
    //                             </li>
    //                             <li class="nav-item">
    //                                 <a class="nav-link text-decoration-underline" href="../index.html">Criação de usuários</a>
    //                             </li>
    //                         </ul>
