document.addEventListener("DOMContentLoaded", renderRH);

function renderRH() {
    const container = document.getElementById("lista-rh");
    const requests = JSON.parse(localStorage.getItem("requests")) || [];
    const positions = JSON.parse(localStorage.getItem("positions")) || [];

    container.innerHTML = "";

    if (requests.length === 0) {
        container.innerHTML = '<tr><td colspan="3" class="text-center">Nenhuma solicitação encontrada</td></tr>';
        return;
    }

    requests
        .filter(req => req.estado === "aprovado" || req.estado === "contratado")
        .forEach(req => {
        const cargo = positions.find(p => p.id === req.cargo);
        const nomeCargo = cargo ? cargo.nome : "Cargo não encontrado";

        let acao = "";
        if (req.estado === "contratado") {
            acao = `<button class="btn btn-sm btn-secondary btn-desfazer-rh" onclick="alterarStatusRH(${req.id}, 'aprovado')">
                        <span class="texto-normal">Enviado</span>
                        <span class="texto-hover">Desfazer</span>
                     </button>`;
        } else {
            acao = `<button class="btn btn-sm btn-success" onclick="alterarStatusRH(${req.id}, 'contratado')">Encaminhar memorando</button>`;
        }

        container.innerHTML += `
            <tr>
                <td>#${req.id}</td>
                <td>${nomeCargo}</td>
                <td>${acao}</td>
            </tr>
        `;
    });
}

function alterarStatusRH(id, novoEstado) {
    let requests = JSON.parse(localStorage.getItem("requests")) || [];
    requests = requests.map(req => req.id === id ? { ...req, estado: novoEstado } : req);
    localStorage.setItem("requests", JSON.stringify(requests));
    renderRH();
}



// Dados iniciais padrão
const padraoEscolas = [
    { id: 1, nome: "Castelo", local: "Santa Isabel" },
    { id: 2, nome: "Mercedes", local: "Centro" },
    { id: 3, nome: "Glória", local: "Pedra Branca" },
    { id: 4, nome: "Magda", local: "Britadeira" }
];

const padraoCargos = [
    { id: 1, nome: "Professor Educação Infantil", cargaHoraria: "20h", tipo: "Professores" },
    { id: 2, nome: "Servente", cargaHoraria: "40h", tipo: "Apoio" },
    { id: 3, nome: "Cuidador", cargaHoraria: "40h", tipo: "Apoio" },
    { id: 4, nome: "Estagiário 30h", cargaHoraria: "30h", tipo: "Estágio" },
    { id: 5, nome: "Estagiário 20h", cargaHoraria: "20h", tipo: "Estágio" }
];

// Injeta os modais no body
const modaisRH = `
<!-- Modal Escolas -->
<div class="modal fade" id="modalEscolas" tabindex="-1">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Gerenciar Escolas</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <form id="formEscola" class="row g-2 mb-4">
          <div class="col-md-6">
            <input type="text" id="nomeEscola" class="form-control" placeholder="Nome da Escola" required>
          </div>
          <div class="col-md-4">
            <input type="text" id="localEscola" class="form-control" placeholder="Bairro/Local" required>
          </div>
          <div class="col-md-2">
            <button type="submit" class="btn btn-primary w-100">Adicionar</button>
          </div>
        </form>
        <ul class="list-group" id="listaEscolas"></ul>
      </div>
    </div>
  </div>
</div>

<!-- Modal Cargos -->
<div class="modal fade" id="modalCargos" tabindex="-1">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Gerenciar Cargos</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <form id="formCargo" class="row g-2 mb-4">
          <div class="col-md-5">
            <input type="text" id="nomeCargo" class="form-control" placeholder="Nome do Cargo" required>
          </div>
          <div class="col-md-3">
            <input type="text" id="cargaCargo" class="form-control" placeholder="Carga Horária (ex: 40h)" required>
          </div>
          <div class="col-md-2">
            <input type="text" id="tipoCargo" class="form-control" placeholder="Tipo" required>
          </div>
          <div class="col-md-2">
            <button type="submit" class="btn btn-primary w-100">Adicionar</button>
          </div>
        </form>
        <ul class="list-group" id="listaCargos"></ul>
      </div>
    </div>
  </div>
</div>`;

document.body.insertAdjacentHTML('beforeend', modaisRH);

// Renderização das listas
function carregarEscolas() {
    const escolas = JSON.parse(localStorage.getItem('escolas')) || padraoEscolas;
    if (!localStorage.getItem('escolas')) localStorage.setItem('escolas', JSON.stringify(escolas));
    
    const lista = document.getElementById('listaEscolas');
    lista.innerHTML = escolas.map(e => `
        <li class="list-group-item d-flex justify-content-between align-items-center">
            <span><strong>${e.nome}</strong> - ${e.local}</span>
            <span class="badge bg-secondary">#${e.id}</span>
        </li>
    `).join('');
}

function carregarCargos() {
    const cargos = JSON.parse(localStorage.getItem('positions')) || padraoCargos;
    if (!localStorage.getItem('positions')) localStorage.setItem('positions', JSON.stringify(cargos));
    
    const lista = document.getElementById('listaCargos');
    lista.innerHTML = cargos.map(c => `
        <li class="list-group-item d-flex justify-content-between align-items-center">
            <span><strong>${c.nome}</strong> (${c.cargaHoraria}) - <small class="text-muted">${c.tipo}</small></span>
            <span class="badge bg-secondary">#${c.id}</span>
        </li>
    `).join('');
}

// Salvar novos registros
document.getElementById('formEscola').addEventListener('submit', (e) => {
    e.preventDefault();
    const escolas = JSON.parse(localStorage.getItem('escolas')) || padraoEscolas;
    const nova = {
        id: escolas.length ? Math.max(...escolas.map(item => item.id)) + 1 : 1,
        nome: document.getElementById('nomeEscola').value,
        local: document.getElementById('localEscola').value
    };
    escolas.push(nova);
    localStorage.setItem('escolas', JSON.stringify(escolas));
    e.target.reset();
    carregarEscolas();
});

document.getElementById('formCargo').addEventListener('submit', (e) => {
    e.preventDefault();
    const cargos = JSON.parse(localStorage.getItem('positions')) || padraoCargos;
    const novo = {
        id: cargos.length ? Math.max(...cargos.map(item => item.id)) + 1 : 1,
        nome: document.getElementById('nomeCargo').value,
        cargaHoraria: document.getElementById('cargaCargo').value,
        tipo: document.getElementById('tipoCargo').value
    };
    cargos.push(novo);
    localStorage.setItem('positions', JSON.stringify(cargos));
    e.target.reset();
    carregarCargos();
});


document.getElementById('modalEscolas').addEventListener('show.bs.modal', carregarEscolas);
document.getElementById('modalCargos').addEventListener('show.bs.modal', carregarCargos);


// Renderização das listas com botões
function carregarEscolas() {
    const escolas = JSON.parse(localStorage.getItem('escolas')) || padraoEscolas;
    if (!localStorage.getItem('escolas')) localStorage.setItem('escolas', JSON.stringify(escolas));
    
    const lista = document.getElementById('listaEscolas');
    lista.innerHTML = escolas.map(e => `
        <li class="list-group-item d-flex justify-content-between align-items-center">
            <span><strong>${e.nome}</strong> - ${e.local}</span>
            <div>
                <button class="btn btn-sm btn-outline-secondary me-1" onclick="editarEscola(${e.id})">Editar</button>
                <button class="btn btn-sm btn-outline-danger" onclick="excluirEscola(${e.id})">Excluir</button>
            </div>
        </li>
    `).join('');
}

function carregarCargos() {
    const cargos = JSON.parse(localStorage.getItem('positions')) || padraoCargos;
    if (!localStorage.getItem('positions')) localStorage.setItem('positions', JSON.stringify(cargos));
    
    const lista = document.getElementById('listaCargos');
    lista.innerHTML = cargos.map(c => `
        <li class="list-group-item d-flex justify-content-between align-items-center">
            <span><strong>${c.nome}</strong> (${c.cargaHoraria}) - <small class="text-muted">${c.tipo}</small></span>
            <div>
                <button class="btn btn-sm btn-outline-secondary me-1" onclick="editarCargo(${c.id})">Editar</button>
                <button class="btn btn-sm btn-outline-danger" onclick="excluirCargo(${c.id})">Excluir</button>
            </div>
        </li>
    `).join('');
}

// Funções de Exclusão
function excluirEscola(id) {
    let escolas = JSON.parse(localStorage.getItem('escolas')) || [];
    escolas = escolas.filter(e => e.id !== id);
    localStorage.setItem('escolas', JSON.stringify(escolas));
    carregarEscolas();
}

function excluirCargo(id) {
    let cargos = JSON.parse(localStorage.getItem('positions')) || [];
    cargos = cargos.filter(c => c.id !== id);
    localStorage.setItem('positions', JSON.stringify(cargos));
    carregarCargos();
}

// Funções de Edição via Prompt
function editarEscola(id) {
    let escolas = JSON.parse(localStorage.getItem('escolas')) || [];
    const escola = escolas.find(e => e.id === id);
    if (!escola) return;

    const novoNome = prompt("Nome da Escola:", escola.nome);
    const novoLocal = prompt("Local da Escola:", escola.local);

    if (novoNome && novoLocal) {
        escola.nome = novoNome;
        escola.local = novoLocal;
        localStorage.setItem('escolas', JSON.stringify(escolas));
        carregarEscolas();
    }
}

function editarCargo(id) {
    let cargos = JSON.parse(localStorage.getItem('positions')) || [];
    const cargo = cargos.find(c => c.id === id);
    if (!cargo) return;

    const novoNome = prompt("Nome do Cargo:", cargo.nome);
    const novaCarga = prompt("Carga Horária:", cargo.cargaHoraria);
    const novoTipo = prompt("Tipo:", cargo.tipo);

    if (novoNome && novaCarga && novoTipo) {
        cargo.nome = novoNome;
        cargo.cargaHoraria = novaCarga;
        cargo.tipo = novoTipo;
        localStorage.setItem('positions', JSON.stringify(cargos));
        carregarCargos();
    }
}