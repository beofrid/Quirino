import { supabase } from '../config/supabase.js';
import { appUrl } from '../config/appPaths.js';
import { getRouteForRole } from '../config/roleRoutes.js';
import { AuthService } from '../services/AuthService.js';

export class NavbarController {
    constructor(navbarElement) {
        this.authService = new AuthService(supabase);
        this.emailDisplay = navbarElement.querySelector('#userEmailDisplay');
        this.sessionAction = navbarElement.querySelector('#sessionAction, #sair');
        this.painelTrabalhoLink = navbarElement.querySelector('#painelTrabalhoLink');
        this.isAuthenticated = false;
        this.init();
    }

    async init() {
        if (!this.emailDisplay || !this.sessionAction) return;

        this.sessionAction.addEventListener('click', (event) => this.handleSessionAction(event));

        try {
            const user = await this.authService.getCurrentUser();

            if (!user?.email) {
                this.showLoggedOutState();
                return;
            }

            this.showLoggedInState(user.email);
            await this.configureWorkPanelLink(user.id);
        } catch (error) {
            console.error('Erro ao carregar os dados da navbar:', error);
            this.showLoadingError();
        }
    }

    async configureWorkPanelLink(userId) {
        if (!this.painelTrabalhoLink) return;

        try {
            await this.authService.loadUserProfile(userId);
            this.painelTrabalhoLink.href = getRouteForRole(this.authService.currentUser?.role);
        } catch (error) {
            console.error('Erro ao carregar o perfil para o painel:', error);
            this.painelTrabalhoLink.href = appUrl('index.html');
        }
    }

    async handleSessionAction(event) {
        if (!this.isAuthenticated) return;

        event.preventDefault();
        this.sessionAction.setAttribute('aria-disabled', 'true');
        this.sessionAction.textContent = 'Saindo...';

        try {
            await this.authService.logout();
            window.location.href = appUrl('index.html');
        } catch (error) {
            console.error('Erro ao encerrar sessão:', error);
            this.emailDisplay.textContent = error.message || 'Erro ao sair';
            this.emailDisplay.className = 'badge bg-danger rounded-pill fw-normal';
            this.sessionAction.removeAttribute('aria-disabled');
            this.sessionAction.textContent = 'Sair';
        }
    }

    showLoggedInState(email) {
        this.isAuthenticated = true;
        this.emailDisplay.textContent = email;
        this.emailDisplay.className = 'badge bg-primary rounded-pill fw-normal';
        this.sessionAction.textContent = 'Sair';
        this.sessionAction.href = '#';
        this.sessionAction.className = 'text-danger text-decoration-none';
    }

    showLoggedOutState() {
        this.isAuthenticated = false;
        this.emailDisplay.textContent = 'Não logado';
        this.emailDisplay.className = 'badge bg-secondary rounded-pill fw-normal';
        this.sessionAction.textContent = 'Entrar';
        this.sessionAction.href = appUrl('index.html');
        this.sessionAction.className = 'text-primary text-decoration-none';

        if (this.painelTrabalhoLink) {
            this.painelTrabalhoLink.href = appUrl('index.html');
        }
    }

    showLoadingError() {
        this.isAuthenticated = false;
        this.emailDisplay.textContent = 'Erro ao carregar usuário';
        this.emailDisplay.className = 'badge bg-danger rounded-pill fw-normal';
        this.sessionAction.textContent = 'Entrar';
        this.sessionAction.href = appUrl('index.html');
        this.sessionAction.className = 'text-primary text-decoration-none';

        if (this.painelTrabalhoLink) {
            this.painelTrabalhoLink.href = appUrl('index.html');
        }
    }
}
