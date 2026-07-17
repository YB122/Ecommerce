describe("Subcategory module — /v1/subcategory", () => {
  let token: string;

  before(() => {
    cy.loginAsUser().then((res) => { token = res.token; });
  });

  // ── Public endpoints ──

  describe("GET /subcategory (public)", () => {
    it("returns active subcategories", () => {
      cy.request("/subcategory").then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.have.property("data");
      });
    });
  });

  describe("GET /subcategory/:id (public)", () => {
    it("returns 404 for non-existent", () => {
      cy.request({ method: "GET", url: "/subcategory/99999", failOnStatusCode: false }).then((res) => {
        expect(res.status).to.eq(404);
      });
    });
  });

  // ── Admin endpoints ──

  describe("POST /subcategory/admin (admin-only)", () => {
    it("rejects user role", () => {
      cy.api({ method: "POST", url: "/subcategory/admin", body: { en_name: `Sub_${Date.now()}`, categoryId: 1 }, token, role: "user" }).then((res) => {
        expect(res.status).to.eq(403);
      });
    });
    it("returns 401 without token", () => {
      cy.request({ method: "POST", url: "/subcategory/admin", body: { en_name: "Test", categoryId: 1 }, failOnStatusCode: false }).then((res) => {
        expect(res.status).to.eq(401);
      });
    });
    it("rejects missing fields", () => {
      cy.api({ method: "POST", url: "/subcategory/admin", body: {}, token, role: "user" }).then((res) => {
        expect(res.status).to.eq(403);
      });
    });
  });

  describe("PUT /subcategory/admin/:id (admin-only)", () => {
    it("rejects user role", () => {
      cy.api({ method: "PUT", url: "/subcategory/admin/99999", body: { en_name: "Updated" }, token, role: "user" }).then((res) => {
        expect(res.status).to.eq(403);
      });
    });
  });

  describe("GET /subcategory/admin (admin-only)", () => {
    it("rejects user role", () => {
      cy.api({ method: "GET", url: "/subcategory/admin", token, role: "user" }).then((res) => {
        expect(res.status).to.eq(403);
      });
    });
  });

  describe("GET /subcategory/admin/:id (admin-only)", () => {
    it("rejects user role", () => {
      cy.api({ method: "GET", url: "/subcategory/admin/1", token, role: "user" }).then((res) => {
        expect(res.status).to.eq(403);
      });
    });
  });

  describe("DELETE /subcategory/admin/:id (admin-only)", () => {
    it("rejects user role", () => {
      cy.api({ method: "DELETE", url: "/subcategory/admin/99999", token, role: "user" }).then((res) => {
        expect(res.status).to.eq(403);
      });
    });
    it("returns 401 without token", () => {
      cy.request({ method: "DELETE", url: "/subcategory/admin/99999", failOnStatusCode: false }).then((res) => {
        expect(res.status).to.eq(401);
      });
    });
  });
});
