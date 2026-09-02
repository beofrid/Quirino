import { supabase } from '../config/supabase.js';
import { AuthService } from '../services/AuthService.js';

class AuthController {
    constructor(authService) {
        this.authService = authService;
        this.form = document.getElementById('loginForm');
        this.errorDisplay = document.getElementById('loginError');
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleLogin(e));
        }
    }

    async handleLogin(event) {
        event.preventDefault(); 
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            this.errorDisplay.classList.add('d-none');
            const user = await this.authService.login(email, password);
            this.redirectUser(user.role);
        } catch (error) {
            this.errorDisplay.textContent = "Erro: Credenciais inválidas.";
            this.errorDisplay.classList.remove('d-none');
        }
    }

    redirectUser(role) {
        const routes = {
            'escola': 'protected/escola.html',
            'pedagogico': 'protected/pedagogico/painel.html',
            'rh_sme': 'protected/rh_sme/contrata.html',
            'rh_adm': 'protected/rh_adm.html'
        };
        window.location.href = routes[role] || 'login.html';
    }
}


const authService = new AuthService(supabase);
new AuthController(authService);
