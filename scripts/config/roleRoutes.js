const ROLE_ROUTES = Object.freeze({
    escola: '/protected/escola/contrata.html',
    pedagogico: '/protected/pedagogico/painel.html',
    rh_sme: '/protected/rh_sme/contrata.html',
    rh_adm: '/protected/rh_adm/painel.html'
});

export function getRouteForRole(role) {
    return ROLE_ROUTES[role] || '/index.html';
}
