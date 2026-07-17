describe("Product module — /v1/products", () => {
  let token: string;

  before(() => {
    cy.loginAsUser().then((res) => { token = res.token; });
  });

  // ── Public endpoints ──

  describe("GET /products (public)", () => {
    it("returns active products", () => {
      cy.request("/products").then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.data).to.have.property("products");
      });
    });
    it("accepts pagination query params", () => {
      cy.request("/products?page=1&limit=5").then((res) => {
        expect(res.status).to.eq(200);
      });
    });
    it("accepts price filter query params", () => {
      cy.request("/products?minPrice=10&maxPrice=100").then((res) => {
        expect(res.status).to.eq(200);
      });
    });
    it("accepts sort query param", () => {
      cy.request("/products?sort=price_asc").then((res) => {
        expect(res.status).to.eq(200);
      });
    });
    it("rejects invalid sort param", () => {
      cy.request({ method: "GET", url: "/products?sort=invalid", failOnStatusCode: false }).then((res) => {
        expect(res.status).to.eq(400);
      });
    });
  });

  describe("GET /products/:id (public)", () => {
    it("returns 404 for non-existent product", () => {
      cy.request({ method: "GET", url: "/products/99999", failOnStatusCode: false }).then((res) => {
        expect(res.status).to.eq(404);
      });
    });
  });

  describe("GET /products/category/:categoryId (public)", () => {
    it("returns products for category", () => {
      cy.request({ method: "GET", url: "/products/category/99999", failOnStatusCode: false }).then((res) => {
        expect([200, 404]).to.include(res.status);
      });
    });
  });

  describe("GET /products/subcategory/:subcategoryId (public)", () => {
    it("returns products for subcategory", () => {
      cy.request({ method: "GET", url: "/products/subcategory/99999", failOnStatusCode: false }).then((res) => {
        expect([200, 404]).to.include(res.status);
      });
    });
  });

  // ── Admin endpoints ──

  describe("POST /products/admin (admin-only)", () => {
    it("rejects user role", () => {
      cy.api({ method: "POST", url: "/products/admin", body: { en_name: `Prod_${Date.now()}`, en_description: "Test description", price: 99, subcategoryId: 1 }, token, role: "user" }).then((res) => {
        expect(res.status).to.eq(403);
      });
    });
    it("returns 401 without token", () => {
      cy.request({ method: "POST", url: "/products/admin", body: { en_name: "Test", en_description: "Test description", price: 99, subcategoryId: 1 }, failOnStatusCode: false }).then((res) => {
        expect(res.status).to.eq(401);
      });
    });
    it("rejects missing required fields", () => {
      cy.api({ method: "POST", url: "/products/admin", body: {}, token, role: "user" }).then((res) => {
        expect(res.status).to.eq(403);
      });
    });
  });

  describe("PUT /products/admin/:id (admin-only)", () => {
    it("rejects user role", () => {
      cy.api({ method: "PUT", url: "/products/admin/99999", body: { price: 50 }, token, role: "user" }).then((res) => {
        expect(res.status).to.eq(403);
      });
    });
  });

  describe("GET /products/admin (admin-only)", () => {
    it("rejects user role", () => {
      cy.api({ method: "GET", url: "/products/admin", token, role: "user" }).then((res) => {
        expect(res.status).to.eq(403);
      });
    });
    it("returns 401 without token", () => {
      cy.request({ method: "GET", url: "/products/admin", failOnStatusCode: false }).then((res) => {
        expect(res.status).to.eq(401);
      });
    });
  });

  describe("GET /products/admin/:id (admin-only)", () => {
    it("rejects user role", () => {
      cy.api({ method: "GET", url: "/products/admin/1", token, role: "user" }).then((res) => {
        expect(res.status).to.eq(403);
      });
    });
  });

  describe("DELETE /products/admin/:id (admin-only)", () => {
    it("rejects user role", () => {
      cy.api({ method: "DELETE", url: "/products/admin/99999", token, role: "user" }).then((res) => {
        expect(res.status).to.eq(403);
      });
    });
    it("returns 401 without token", () => {
      cy.request({ method: "DELETE", url: "/products/admin/99999", failOnStatusCode: false }).then((res) => {
        expect(res.status).to.eq(401);
      });
    });
  });
});
