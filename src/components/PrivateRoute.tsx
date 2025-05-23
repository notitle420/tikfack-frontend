// src/components/PrivateRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import keycloak from '../auth/keycloak';

// children の型を React.ReactNode に
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return keycloak.authenticated ? <>{children}</> : <Navigate to="/" replace />;
};

export default PrivateRoute;