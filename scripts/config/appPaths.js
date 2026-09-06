const APP_BASE_URL = new URL('../../', import.meta.url);

export function appUrl(path = '') {
    const normalizedPath = path.replace(/^\/+/, '');
    return new URL(normalizedPath, APP_BASE_URL).href;
}
