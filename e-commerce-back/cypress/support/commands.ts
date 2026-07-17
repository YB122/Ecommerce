declare global {
  namespace Cypress {
    interface Chainable {
      signup(email: string, password: string): Chainable<Cypress.Response<any>>;
      login(email: string, password: string): Chainable<Cypress.Response<any>>;
      loginAsUser(): Chainable<{ token: string; email: string }>;
      api(options: {
        method: string;
        url: string;
        body?: any;
        token?: string;
        role?: string;
      }): Chainable<Cypress.Response<any>>;
    }
  }
}

Cypress.Commands.add("signup", (email: string, password: string) => {
  cy.request({
    method: "POST",
    url: "/auth/signup",
    body: { email, password, confirmPassword: password },
    failOnStatusCode: false,
  });
});

Cypress.Commands.add("login", (email: string, password: string) => {
  cy.request({
    method: "POST",
    url: "/auth/login",
    body: { email, password },
    failOnStatusCode: false,
  });
});

Cypress.Commands.add("loginAsUser", () => {
  const email = `user_${Date.now()}@test.com`;
  cy.signup(email, "password123");
  return cy.login(email, "password123").then((res) => {
    const token = res.body.accessToken as string;
    Cypress.env("userToken", token);
    return cy.wrap({ token, email });
  });
});

Cypress.Commands.add("api", ({ method, url, body, token, role }: {
  method: string;
  url: string;
  body?: any;
  token?: string;
  role?: string;
}) => {
  const headers: Record<string, string> = {};
  if (token) {
    headers.Authorization = `${role || "user"} ${token}`;
  }
  return cy.request({
    method,
    url,
    body,
    headers,
    failOnStatusCode: false,
  });
});

export {};
