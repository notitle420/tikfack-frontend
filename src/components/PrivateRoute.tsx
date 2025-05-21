import React from 'react';
import { Navigate } from 'react-router-dom';
import keycloak from '../auth/keycloak';

const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  return keycloak.authenticated ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;
