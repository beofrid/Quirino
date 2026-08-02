document.addEventListener("DOMContentLoaded", renderPedagogico);

function alterarStatus(id, novoEstado) {
    let requests = JSON.parse(localStorage.getItem("requests")) || [];
    requests = requests.map(req => req.id === id ? { ...req, estado: novoEstado } : req);
    localStorage.setItem("requests", JSON.stringify(requests));
    renderPedagogico();
}

function renderPedagogico() {
    const container = document.getElementById("lista-pedagogico");
    const requests = JSON.parse(localStorage.getItem("requests")) || [];
    const positions = JSON.parse(localStorage.getItem("positions")) || [];

    container.innerHTML = "";

    if (requests.length === 0) {
        container.innerHTML = '<tr><td colspan="4" class="text-center">Nenhuma solicitação encontrada</td></tr>';
        return;
    }

    requests.forEach(req => {
        const cargo = positions.find(p => p.id === req.cargo);
        const nomeCargo = cargo ? cargo.nome : "Cargo não encontrado";

        let acoes = "";
        if (req.estado === "pendente") {
            acoes = `<button class="btn btn-sm btn-success me-1" onclick="alterarStatus(${req.id}, 'aprovado')">Aprovar</button>
                     <button class="btn btn-sm btn-danger" onclick="alterarStatus(${req.id}, 'rejeitado')">Recusar</button>`;
        } else if (req.estado === "aprovado" || req.estado === "rejeitado") {
            acoes = `<button class="btn btn-sm btn-outline-secondary btn-desfazer" onclick="alterarStatus(${req.id}, 'pendente')">
                        <span class="texto-normal ">Concluído</span>
                        <span class="texto-hover">Desfazer</span>
            </button>`;        } else {
            acoes = `<span class="text-muted">Finalizado</span>`;
        }

        container.innerHTML += `
            <tr>
                <td>#${req.id}</td>
                <td>${nomeCargo}</td>
                <td><span class="badge bg-secondary">${req.estado}</span></td>
                <td>${acoes}</td>
            </tr>
        `;
    });
}