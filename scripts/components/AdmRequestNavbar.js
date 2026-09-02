class RequestNavbar extends HTMLElement {
    constructor() {
        super();

        this.routes = [
            {
                id: "contratacao",
                label: "Contratação",
                route: "contrata.html"
            },
            {
                id: "desdobramento",
                label: "Regime Suplementar",
                route: "desdobramento.html"
            },
            {
                id: "ferias",
                label: "Férias",
                route: "ferias.html"
            },
            {
                id: "usuarios",
                label: "Gerenciar Usuários",
                route: "users.html"
            },
            {
                id: "cargos",
                label: "Ver Cargos",
                route: "cargos.html"
            }
        ];
    }

    connectedCallback() {
        this.render();
        this.addEvents();
    }

    get activeRoute() {
        return this.getAttribute("active");
    }

    render() {
        this.innerHTML = `
            <nav 
                class="d-flex justify-content-end align-items-center mb-4 gap-2 flex-wrap"
                aria-label="Navegação administrativa"
            >
                ${this.routes.map(route => `
                    <button
                        type="button"
                        class="btn btn-primary"
                        data-route="${route.id}"
                        ${route.id === this.activeRoute ? "disabled" : ""}
                    >
                        ${route.label}
                    </button>
                `).join("")}
            </nav>
        `;
    }

    addEvents() {
        this.querySelectorAll("[data-route]").forEach(button => {
            button.addEventListener("click", () => {
                const routeId = button.dataset.route;
                this.navigate(routeId);
            });
        });
    }

    navigate(routeId) {
        const route = this.routes.find(route => route.id === routeId);

        if (!route || !route.route) return;

        window.location.href = route.route;
    }
}

customElements.define("request-navbar", RequestNavbar);