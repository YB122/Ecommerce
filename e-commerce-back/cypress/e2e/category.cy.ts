describe("Category module — /v1/category", () => {
  let token: string;

  before(() => {
    cy.loginAsUser().then((res) => { token = res.token; });
  });

  // ── Public endpoints ──

  describe("GET /category (public)", () => {
    it("returns active categories", () => {
      cy.request("/category").then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.have.property("data");
      });
    });
  });

  describe("GET /category/:id/subcategories (public)", () => {
    it("returns subcategories for a category", () => {
      cy.request({ method: "GET", url: "/category/99999/subcategories", failOnStatusCode: false }).then((res) => {
        expect([200, 404]).to.include(res.status);
      });
    });
  });

  // ── Admin endpoints (tested with user role → 403) ──

  describe("POST /category/admin (admin-only)", () => {
    it("rejects user role", () => {
      cy.api({ method: "POST", url: "/category/admin", body: { en_name: `Cat_${Date.now()}` }, token, role: "user" }).then((res) => {
        expect(res.status).to.eq(403);
      });
    });
    it("returns 401 without token", () => {
      cy.request({ method: "POST", url: "/category/admin", body: { en_name: "Test" }, failOnStatusCode: false }).then((res) => {
        expect(res.status).to.eq(401);
      });
    });
    it("rejects missing name", () => {
      cy.api({ method: "POST", url: "/category/admin", body: {}, token, role: "user" }).then((res) => {
        expect(res.status).to.eq(403); // blocked by role before validation
      });
    });
  });

  describe("PUT /category/admin/:id (admin-only)", () => {
    it("rejects user role", () => {
      cy.api({ method: "PUT", url: "/category/admin/99999", body: { en_name: "Updated" }, token, role: "user" }).then((res) => {
        expect(res.status).to.eq(403);
      });
    });
    it("returns 401 without token", () => {
      cy.request({ method: "PUT", url: "/category/admin/99999", body: { en_name: "Updated" }, failOnStatusCode: false }).then((res) => {
        expect(res.status).to.eq(401);
      });
    });
  });

  describe("GET /category/admin (admin-only)", () => {
    it("rejects user role", () => {
      cy.api({ method: "GET", url: "/category/admin", token, role: "user" }).then((res) => {
        expect(res.status).to.eq(403);
      });
    });
    it("returns 401 without token", () => {
      cy.request({ method: "GET", url: "/category/admin", failOnStatusCode: false }).then((res) => {
        expect(res.status).to.eq(401);
      });
    });
  });

  describe("GET /category/admin/:id (admin-only)", () => {
    it("rejects user role", () => {
      cy.api({ method: "GET", url: "/category/admin/1", token, role: "user" }).then((res) => {
        expect(res.status).to.eq(403);
      });
    });
  });

  describe("DELETE /category/admin/:id (admin-only)", () => {
    it("rejects user role", () => {
      cy.api({ method: "DELETE", url: "/category/admin/99999", token, role: "user" }).then((res) => {
        expect(res.status).to.eq(403);
      });
    });
    it("returns 401 without token", () => {
      cy.request({ method: "DELETE", url: "/category/admin/99999", failOnStatusCode: false }).then((res) => {
        expect(res.status).to.eq(401);
      });
    });
  });
});
