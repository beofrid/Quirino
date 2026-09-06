import { supabase } from '../config/supabase.js';
import { UserService } from '../services/UserService.js';

class UserCreationController {
    constructor() {
        this.userService = new UserService(supabase);
        this.form = document.getElementById('formCriarUsuario');
        this.feedback = document.getElementById('feedbackMensagem');
        this.botaoRegistrar = document.getElementById('botaoRegistrar');
        this.listaUsuarios = document.getElementById('listaUsuarios');
        this.totalUsuarios = document.getElementById('totalUsuarios');
        this.roleLabels = Object.freeze({
            escola: 'Escola',
            pedagogico: 'Pedagógico',
            rh_sme: 'RH Interno',
            rh_adm: 'RH Geral'
        });
        this.init();
    }

    init() {
        if (!this.form) return;

        this.form.addEventListener('submit', (event) => this.handleCreation(event));
        this.carregarUsuarios();
    }

    async handleCreation(event) {
        event.preventDefault();

        const email = document.getElementById('email').value.trim();
        const senha = document.getElementById('senha').value;
        const role = document.getElementById('role').value;
        const setor = document.getElementById('setor').value.trim();

        this.setLoading(true);
        this.mostrarFeedback('Criando usuário...', 'info');

        try {
            await this.userService.criarUsuario(email, senha, role, setor);
            this.mostrarFeedback('Usuário criado com sucesso!', 'success');
            this.form.reset();
            await this.carregarUsuarios();
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            this.mostrarFeedback(error.message || 'Não foi possível criar o usuário.', 'danger');
        } finally {
            this.setLoading(false);
        }
    }

    async carregarUsuarios() {
        this.mostrarEstadoLista('Carregando usuários...');
        this.totalUsuarios.textContent = 'Carregando...';

        try {
            const usuarios = await this.userService.listarUsuarios();
            this.renderizarUsuarios(usuarios);
            this.totalUsuarios.textContent = `${usuarios.length} ${usuarios.length === 1 ? 'usuário' : 'usuários'}`;
        } catch (error) {
            console.error('Erro ao listar usuários:', error);
            this.mostrarEstadoLista(error.message || 'Não foi possível carregar os usuários.', 'text-danger');
            this.totalUsuarios.textContent = 'Erro ao carregar';
            this.totalUsuarios.className = 'badge text-bg-danger';
        }
    }

    renderizarUsuarios(usuarios) {
        this.listaUsuarios.replaceChildren();

        if (usuarios.length === 0) {
            this.mostrarEstadoLista('Nenhum usuário cadastrado.');
            return;
        }

        const fragmento = document.createDocumentFragment();

        usuarios.forEach((usuario) => {
            const linha = document.createElement('tr');
            const colunaNome = document.createElement('td');
            const colunaRole = document.createElement('td');
            const badgeRole = document.createElement('span');

            colunaNome.className = 'ps-4 text-break';
            colunaNome.textContent = usuario.name;
            badgeRole.className = 'badge text-bg-light border text-dark fw-normal';
            badgeRole.textContent = this.roleLabels[usuario.role] || usuario.role;
            colunaRole.appendChild(badgeRole);
            linha.append(colunaNome, colunaRole);
            fragmento.appendChild(linha);
        });

        this.listaUsuarios.appendChild(fragmento);
        this.totalUsuarios.className = 'badge text-bg-secondary';
    }

    mostrarEstadoLista(mensagem, classe = 'text-secondary') {
        const linha = document.createElement('tr');
        const coluna = document.createElement('td');

        coluna.colSpan = 2;
        coluna.className = `text-center py-4 ${classe}`;
        coluna.textContent = mensagem;
        linha.appendChild(coluna);
        this.listaUsuarios.replaceChildren(linha);
    }

    mostrarFeedback(mensagem, tipo) {
        this.feedback.textContent = mensagem;
        this.feedback.className = `alert alert-${tipo} mt-3 mb-0`;
    }

    setLoading(loading) {
        this.botaoRegistrar.disabled = loading;
        this.botaoRegistrar.textContent = loading ? 'Registrando...' : 'Registrar usuário';
    }
}

new UserCreationController();
