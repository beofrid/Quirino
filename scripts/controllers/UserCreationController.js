import { supabase } from '../config/supabase.js';
import { UserService } from '../services/UserService.js';

class UserCreationController {
    constructor() {
        this.userService = new UserService(supabase);
        this.form = document.getElementById('formCriarUsuario');
        this.feedback = document.getElementById('feedbackMensagem');
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleCreation(e));
        }
    }

    async handleCreation(event) {
        event.preventDefault();
        
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;
        const role = document.getElementById('role').value;
        const setor = document.getElementById('setor').value;

        this.mostrarFeedback("Criando usuário...", "text-info");

        try {
            await this.userService.criarUsuario(email, senha, role, setor);
            this.mostrarFeedback("Usuário criado com sucesso!", "text-success");
            this.form.reset();
        } catch (error) {
            this.mostrarFeedback(error.message, "text-danger");
        }
    }

    mostrarFeedback(mensagem, classeCor) {
        this.feedback.textContent = mensagem;
        this.feedback.className = `mt-3 text-center fw-bold ${classeCor}`;
    }
}

// Inicializa o controller
new UserCreationController();