import { supabase } from '../config/supabase.js';
import { getRouteForRole } from '../config/roleRoutes.js';
import { AuthService } from '../services/AuthService.js';

export class NavbarController {
    constructor(navbarElement) {
        this.authService = new AuthService(supabase);
        this.emailDisplay = navbarElement.querySelector('#userEmailDisplay');
        this.sessionAction = navbarElement.querySelector('#sessionAction');
        this.painelTrabalhoLink = navbarElement.querySelector('#painelTrabalhoLink');
        this.init();
    }

    async init() {
        if (!this.emailDisplay || !this.sessionAction || !this.painelTrabalhoLink) return;

        try {
            const user = await this.authService.getCurrentUser();

            if (user?.email) {
                await this.authService.loadUserProfile(user.id);

                this.emailDisplay.textContent = user.email;
                this.emailDisplay.classList.replace('bg-secondary', 'bg-primary');
                this.sessionAction.textContent = 'Sair';
                this.sessionAction.href = '#';
                this.sessionAction.classList.replace('text-secondary', 'text-danger');
                this.painelTrabalhoLink.href = getRouteForRole(this.authService.currentUser?.role);
                return;
            }

            this.showLoggedOutState();
        } catch (error) {
            console.error('Erro ao carregar os dados da navbar:', error);
            this.emailDisplay.textContent = 'Erro ao carregar usuário';
            this.emailDisplay.classList.replace('bg-secondary', 'bg-danger');
            this.showLoggedOutActions();
        }
    }

    showLoggedOutState() {
        this.emailDisplay.textContent = 'Não logado';
        this.showLoggedOutActions();
    }

    showLoggedOutActions() {
        this.sessionAction.textContent = 'Entrar';
        this.sessionAction.href = '/index.html';
        this.sessionAction.classList.replace('text-secondary', 'text-primary');
        this.painelTrabalhoLink.href = '/index.html';
    }
}
