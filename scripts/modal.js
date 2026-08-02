document.addEventListener("DOMContentLoaded", () => {
    const cargoSelect = document.getElementById("cargoSelect");
    const cargos = JSON.parse(localStorage.getItem("cargos")) || ["Professor", "Cuidador", "Servente"];
    cargos.forEach(c => {
        let opt = document.createElement("option");
        opt.value = c; opt.textContent = c;
        cargoSelect.appendChild(opt);
    });

    const radioSub = document.getElementById("tipoSubstituicao");
    const radioNovo = document.getElementById("tipoNovo");
    const divSub = document.getElementById("substituicao");
    const divCont = document.getElementById("contratacao");
    

    function atualizarCampos() {
        if (radioSub.checked) {
            divSub.style.display = "block";
            divCont.style.display = "none";
        } else if(radioNovo.checked) {
            divSub.style.display = "none";
            divCont.style.display = "block";
        }
    }

    radioSub.addEventListener("change", atualizarCampos);
    radioNovo.addEventListener("change", atualizarCampos);
    atualizarCampos();
});