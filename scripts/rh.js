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