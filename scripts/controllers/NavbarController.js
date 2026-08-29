import { supabase } from '../config/supabase.js';
import { AuthService } from '../services/AuthService.js';

export class NavbarController {
    constructor(navbarElement) {
        this.authService = new AuthService(supabase);
        this.emailDisplay = navbarElement.querySelector('#userEmailDisplay');
        this.init();
    }

    async init() {
        if (!this.emailDisplay) return;

        try {
            const user = await this.authService.getCurrentUser();

            if (user?.email) {
                this.emailDisplay.textContent = user.email;
                this.emailDisplay.classList.replace('bg-secondary', 'bg-primary');
                return;
            }

            this.emailDisplay.textContent = 'Não logado';
        } catch (error) {
            console.error('Erro ao exibir o usuário na navbar:', error);
            this.emailDisplay.textContent = 'Erro ao carregar usuário';
            this.emailDisplay.classList.replace('bg-secondary', 'bg-danger');
        }
    }
}

