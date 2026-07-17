describe("Security module — /v1/admin", () => {
  let token: string;

  before(() => {
    cy.loginAsUser().then((res) => { token = res.token; });
  });

  describe("GET /security/logs (superAdmin-only)", () => {
    it("rejects user role", () => {
      cy.api({ method: "GET", url: "/security/logs", token, role: "user" }).then((res) => {
        expect(res.status).to.eq(403);
      });
    });
    it("rejects admin role", () => {
      cy.api({ method: "GET", url: "/security/logs", token, role: "admin" }).then((res) => {
        expect(res.status).to.eq(403);
      });
    });
    it("returns 401 without token", () => {
      cy.request({ method: "GET", url: "/security/logs", failOnStatusCode: false }).then((res) => {
        expect(res.status).to.eq(401);
      });
    });
  });
});
