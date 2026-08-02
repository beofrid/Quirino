document.addEventListener("DOMContentLoaded", () => {
    const cargoSelect = document.getElementById("cargoSelect");
    if (cargoSelect) {
        const cargos = JSON.parse(localStorage.getItem("positions")) || ["Professor", "Cuidador", "Servente"];
        cargos.forEach(c => {
            let opt = document.createElement("option");
            opt.value = c.id;  
            opt.textContent = c.nome;
            cargoSelect.appendChild(opt);
        });
    }

    const radioSub = document.getElementById("tipoSubstituicao");
    const radioNovo = document.getElementById("tipoNovo");
    const divSub = document.getElementById("substituicao");
    const divCont = document.getElementById("contratacao");

    function atualizarCampos() {
        if (!radioSub || !radioNovo) return;
        if (radioSub.checked) {
            if (divSub) divSub.style.display = "block";
            if (divCont) divCont.style.display = "none";
        } else if(radioNovo.checked) {
            if (divSub) divSub.style.display = "none";
            if (divCont) divCont.style.display = "block";
        }
    }

    radioSub?.addEventListener("change", atualizarCampos);
    radioNovo?.addEventListener("change", atualizarCampos);
    if (radioSub && radioNovo) atualizarCampos();
});

document.querySelector("#modalSolicitacao form")?.addEventListener("submit", (e) => {
    e.preventDefault();

    const requests = JSON.parse(localStorage.getItem("requests")) || [];
    const tipo = document.getElementById("tipoSubstituicao").checked ? "substituição" : "contratação";

    const novaSolicitacao = {
        id: requests.length ? Math.max(...requests.map(r => r.id)) + 1 : 1,
        cargo: Number(document.getElementById("cargoSelect").value),
        horario: `${document.getElementById("entrada1").value} ${document.getElementById("saida1").value} / ${document.getElementById("entrada2").value} ${document.getElementById("saida2").value}`,
        tipo: tipo,
        substituido: tipo === "substituição" ? document.getElementById("sName").value : null,
        matricula: tipo === "substituição" ? document.getElementById("sId").value : null,
        justificativa: tipo === "contratação" ? document.getElementById("textArea").value : null,
        estado: "pendente"
    };

    requests.push(novaSolicitacao);
    localStorage.setItem("requests", JSON.stringify(requests));

    bootstrap.Modal.getInstance(document.getElementById("modalSolicitacao")).hide();
    e.target.reset();
    renderRequests();
});


document.addEventListener("DOMContentLoaded", () => {
    const modalHTML = `
    <div class="modal fade" id="modalSair" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-body text-center">
                <p>O botão de sair ainda não funciona, é só decorativo</p>
                <button class="btn btn-danger" data-bs-dismiss="modal">fechar</button>
            </div>
            </div>
        </div>
    </div>`;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const btnSair = document.getElementById("sair");
    if (btnSair) {
        const modalSair = new bootstrap.Modal(document.getElementById("modalSair"));
        btnSair.addEventListener("click", (e) => {
            e.preventDefault();
            modalSair.show();
        });
    }
});


function preencherModalEditar(id) {
    //pega as informações do local storage para fazer edições
    const requests = JSON.parse(localStorage.getItem('requests')) || [];
    const req = requests.find(r => r.id === id);
    if (!req) return;

    document.getElementById("cargoSelect").value = req.cargo;

    const horários = req.horario ? req.horario.split(" ") : [];
    document.getElementById("entrada1").value = horários[0] || "";
    document.getElementById("saida1").value = horários[1] || "";
    document.getElementById("entrada2").value = horários[3] || "";
    document.getElementById("saida2").value = horários[4] || "";

    const radioSub = document.getElementById("tipoSubstituicao");
    const radioNovo = document.getElementById("tipoNovo");

    if (req.tipo === "substituição") {
        radioSub.checked = true;
        document.getElementById("sName").value = req.substituido || "";
        document.getElementById("sId").value = req.matricula || "";
    } else {
        radioNovo.checked = true;
        document.getElementById("textArea").value = req.justificativa || "";
    }

    //dispara o evento para ocultar os campos divSub e divCont
    radioSub.dispatchEvent(new Event('change'));

    //abre o Modal
    const modalElement = document.getElementById("modalSolicitacao");
    const modalInstance = bootstrap.Modal.getOrCreateInstance(modalElement);
    modalInstance.show();
}
const modaisHTML = `
<div class="modal fade" id="modalVisualizar" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title">Detalhes da Solicitação</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <p><strong>ID:</strong> <span id="v-id"></span></p>
            <p><strong>Cargo:</strong> <span id="v-cargo"></span></p>
            <p><strong>Horário:</strong> <span id="v-horario"></span></p>
            <p><strong>Tipo:</strong> <span id="v-tipo"></span></p>
            <p id="v-container-sub"><strong>Substituído:</strong> <span id="v-substituido"></span> (<span id="v-matricula"></span>)</p>
            <p id="v-container-just"><strong>Justificativa:</strong> <span id="v-justificativa"></span></p>
        <p><strong>Estado:</strong> <span class="badge bg-dark" id="v-estado"></span></p>
        </div>
        </div>
    </div>
    </div>

    <div class="modal fade" id="modalExcluir" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
        <div class="modal-body text-center">
            <p>Excluir a solicitação <strong id="e-id"></strong>?</p>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Não</button>
            <button type="button" class="btn btn-danger" id="btn-confirmar-exclusao">Sim, excluir</button>
        </div>
        </div>
    </div>
</div>`;

document.body.insertAdjacentHTML('beforeend', modaisHTML);


let idParaExcluir = null;

function abrirVisualizar(id) {
    const requests = JSON.parse(localStorage.getItem('requests')) || [];
    const positions = JSON.parse(localStorage.getItem('positions')) || [];
    const req = requests.find(r => r.id === id);
    if (!req) return;
    
    const cargo = positions.find(p => p.id === req.cargo);
    
    document.getElementById('v-id').textContent = `#${req.id}`;
    document.getElementById('v-cargo').textContent = cargo ? cargo.nome : 'N/A';
    document.getElementById('v-horario').textContent = req.horario || 'N/A';
    document.getElementById('v-tipo').textContent = req.tipo;

    
    document.getElementById('v-estado').textContent = req.estado;
    const elementoEstado = document.getElementById('v-estado');
    elementoEstado.textContent = req.estado;
    elementoEstado.className = `badge ${req.estado === 'rejeitado' ? 'bg-danger text-light' : 'bg-primary text-light'}`;

    if (req.tipo === "substituição") {
        document.getElementById('v-container-sub').style.display = 'block';
        document.getElementById('v-container-just').style.display = 'none';
        document.getElementById('v-substituido').textContent = req.substituido;
        document.getElementById('v-matricula').textContent = req.matricula;
    } else {
        document.getElementById('v-container-sub').style.display = 'none';
        document.getElementById('v-container-just').style.display = 'block';
        document.getElementById('v-justificativa').textContent = req.justificativa;
    }

    bootstrap.Modal.getOrCreateInstance(document.getElementById('modalVisualizar')).show();
}

function abrirExcluir(id) {
    idParaExcluir = id;
    document.getElementById('e-id').textContent = `#${id}`;
    bootstrap.Modal.getOrCreateInstance(document.getElementById('modalExcluir')).show();
}

document.getElementById('btn-confirmar-exclusao')?.addEventListener('click', () => {
    if (!idParaExcluir) return;
    let requests = JSON.parse(localStorage.getItem('requests')) || [];
    requests = requests.filter(r => r.id !== idParaExcluir);
    localStorage.setItem('requests', JSON.stringify(requests));
    
    bootstrap.Modal.getInstance(document.getElementById('modalExcluir')).hide();
    renderRequests(); 
});

