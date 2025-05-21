import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: process.env.REACT_APP_KEYCLOAK_URL,
  realm: process.env.REACT_APP_KEYCLOAK_REALM,
  clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID,
});

export function initKeycloak(onAuthenticated: () => void) {
  keycloak
    .init({
      onLoad: 'login-required',
      pkceMethod: 'S256',
      checkLoginIframe: false,
    })
    .then((authenticated) => {
      if (authenticated) {
        onAuthenticated();
      } else {
        keycloak.login();
      }
    })
    .catch((err) => console.error('Keycloak 初期化失敗', err));
}

export default keycloak;
