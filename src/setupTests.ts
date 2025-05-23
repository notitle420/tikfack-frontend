import '@testing-library/jest-dom';

jest.mock('keycloak-js', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    init: jest.fn().mockResolvedValue(true),
    login: jest.fn(),
  })),
}));
