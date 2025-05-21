import Keycloak from 'keycloak-js';

const keycloak = new (Keycloak as any)({
    url: "http://localhost:8080",
    realm: "myrealm",
    clientId: "frontend-client",
    checkLoginIframe: false,
    onLoad: 'login-required',
});

export const initKeycloak = async (onAuthSuccess: () => void) => {
    try {
        const authenticated = await keycloak.init();
        if (authenticated) {
            console.log('User is authenticated');
            onAuthSuccess();
        } else {
            console.log('User is not authenticated');
            keycloak.login()
        }
    } catch (error) {
        console.error('Failed to initialize adapter:', error);
    }
};

export default keycloak;