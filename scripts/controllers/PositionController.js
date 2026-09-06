import { supabase } from '../config/supabase.js';
import { PositionService } from '../services/PositionService.js';

class PositionController {
    constructor() {
        this.service = new PositionService(supabase);
        this.tableBody = document.getElementById('lista-cargos');
        this.counter = document.getElementById('total-cargos');
        this.init();
    }

    async init() {
        if (!this.tableBody || !this.counter) return;

        try {
            const positions = await this.service.listarCargos();
            this.renderPositions(positions);
            this.counter.textContent = `${positions.length} ${positions.length === 1 ? 'cargo' : 'cargos'}`;
        } catch (error) {
            console.error('Erro ao listar cargos:', error);
            this.renderMessage(error.message || 'Não foi possível carregar os cargos.', 'text-danger');
            this.counter.textContent = 'Erro ao carregar';
            this.counter.className = 'badge text-bg-danger';
        }
    }

    renderPositions(positions) {
        this.tableBody.replaceChildren();

        if (positions.length === 0) {
            this.renderMessage('Nenhum cargo cadastrado.');
            return;
        }

        const fragment = document.createDocumentFragment();

        positions.forEach((position) => {
            const row = document.createElement('tr');
            const nameCell = document.createElement('td');
            const workloadCell = document.createElement('td');

            nameCell.textContent = position.position;
            workloadCell.textContent = `${position.workload}h`;
            row.append(nameCell, workloadCell);
            fragment.appendChild(row);
        });

        this.tableBody.appendChild(fragment);
    }

    renderMessage(message, className = 'text-secondary') {
        const row = document.createElement('tr');
        const cell = document.createElement('td');

        cell.colSpan = 2;
        cell.className = `text-center py-4 ${className}`;
        cell.textContent = message;
        row.appendChild(cell);
        this.tableBody.replaceChildren(row);
    }
}

new PositionController();
