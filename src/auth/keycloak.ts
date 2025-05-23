import Keycloak from 'keycloak-js';
import { jwtDecode } from "jwt-decode";

const keycloak = new (Keycloak as any)({
    url: process.env.REACT_APP_KEYCLOAK_URL,
    realm: process.env.REACT_APP_KEYCLOAK_REALM,
    clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID,
    checkLoginIframe: false,
    onLoad: 'login-required',
});

export const initKeycloak = async (onAuthSuccess: () => void) => {
    try {
        const authenticated = await keycloak.init()
        if (authenticated) {
            console.log('User is authenticated');
            const decodedToken = jwtDecode(keycloak.token);
            console.log("Decoded Token:", decodedToken);    
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