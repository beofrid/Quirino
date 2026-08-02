function createLocalStorageDB() {
    const positions = [
        { id: 1, nome: "Professor Educação Infantil", cargaHoraria: "20h", tipo: "Professores" },
        { id: 2, nome: "Servente", cargaHoraria: "40h", tipo: "Apoio" },
        { id: 3, nome: "Cuidador", cargaHoraria: "20h", tipo: "Apoio" },
        { id: 4, nome: "Estagiário 4h diárias", cargaHoraria: "20h", tipo: "Estagiários" },
        { id: 5, nome: "Estagiário 6h diárias", cargaHoraria: "30h", tipo: "Estagiários" }
    ];
    
    const requests = [
        { id: 1, cargo: 1, horario: "8h 12h", tipo: "substituição", substituido: "José Andrade", matricula: "1324", justificativa: null, estado: "rejeitado" },
        { id: 2, cargo: 3, horario: "8h 12h / 14h 18h", tipo: "contratação", substituido: null, matricula: null, justificativa: "Atendimento de aluno com necessidades especiais", estado: "pendente" },
        { id: 3, cargo: 5, horario: "8h 14h", tipo: "substituição", substituido: "Enzo Silva", matricula: "1234", justificativa: null, estado: "aprovado" },
        { id: 4, cargo: 2, horario: "8h 12h / 13h 17h", tipo: "contratação", substituido: null, matricula: null, justificativa: "Limpeza do anexo II", estado: "contratado" }
    ];
    
    if (!localStorage.getItem('requests')) {
        localStorage.setItem('requests', JSON.stringify(requests));
    }
    if (!localStorage.getItem('positions')) {
        localStorage.setItem('positions', JSON.stringify(positions));
    }
}

const container = document.getElementById("lista-solicitacoes");

function renderRequests() {
    const requestList = JSON.parse(localStorage.getItem('requests')) || [];
    const positions = JSON.parse(localStorage.getItem('positions')) || [];
    
    container.innerHTML = ""; 
    if (requestList.length === 0) {
        container.innerHTML = '<tr><td colspan="5" class="text-center">Nada encontrado</td></tr>';
        return;
    }
    
    requestList.forEach((req) => {
        const cargoObj = positions.find(p => p.id === req.cargo);
        const nomeCargo = cargoObj ? cargoObj.nome : "Cargo não encontrado";
        container.innerHTML += requestCard(req, nomeCargo);
    });
}

function requestCard(req, nomeCargo) {
    let badge;
    switch(req.estado){
        case "aprovado":
            badge = "bg-light text-primary"
            break;
        case "pendente":
            badge = "bg-secondary text-light"
            break;
        case "rejeitado":
            badge = "bg-light text-secondary"
            break;
        case "contratado":
            badge = "bg-light text-success"
            break;
    }

const botoes = req.estado === "pendente" 
    ? `<button class="btn btn-sm btn-outline-secondary" onclick="preencherModalEditar(${req.id})">Editar</button>
       <button class="btn btn-sm btn-outline-danger" onclick="abrirExcluir(${req.id})">Excluir</button>`
    : `<button class="btn btn-sm btn-outline-info" onclick="abrirVisualizar(${req.id})">Visualizar</button>`;
    
    return `
        <tr>
            <td>#${req.id}</td>
            <td>${nomeCargo}</td>
            <td>${new Date().toLocaleDateString('pt-BR')}</td>
            <td><span class="badge ${badge}">${req.estado}</span></td>
            <td>${botoes}</td>
        </tr>
    `;
}

document.addEventListener("DOMContentLoaded", () => {
    createLocalStorageDB();
    renderRequests();
});