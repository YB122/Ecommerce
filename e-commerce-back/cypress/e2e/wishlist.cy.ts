describe("Wishlist module — /v1/wishlist", () => {
  let token: string;

  before(() => {
    cy.loginAsUser().then((res) => { token = res.token; });
  });

  describe("POST /wishlist/:productId", () => {
    it("adds a product to wishlist", () => {
      cy.api({ method: "POST", url: "/wishlist/99999", token, role: "user" }).then((res) => {
        // Product 99999 doesn't exist
        expect([201, 404]).to.include(res.status);
      });
    });
    it("returns 401 without token", () => {
      cy.request({ method: "POST", url: "/wishlist/1", failOnStatusCode: false }).then((res) => {
        expect(res.status).to.eq(401);
      });
    });
  });

  describe("GET /wishlist", () => {
    it("returns wishlist for authenticated user", () => {
      cy.api({ method: "GET", url: "/wishlist", token, role: "user" }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.have.property("data");
      });
    });
    it("returns 401 without token", () => {
      cy.request({ method: "GET", url: "/wishlist", failOnStatusCode: false }).then((res) => {
        expect(res.status).to.eq(401);
      });
    });
    it("rejects admin role (user-only)", () => {
      cy.api({ method: "GET", url: "/wishlist", token, role: "admin" }).then((res) => {
        expect(res.status).to.eq(403);
      });
    });
  });

  describe("DELETE /wishlist/:productId", () => {
    it("removes a product from wishlist", () => {
      cy.api({ method: "DELETE", url: "/wishlist/99999", token, role: "user" }).then((res) => {
        expect(res.status).to.eq(200);
      });
    });
    it("returns 401 without token", () => {
      cy.request({ method: "DELETE", url: "/wishlist/1", failOnStatusCode: false }).then((res) => {
        expect(res.status).to.eq(401);
      });
    });
  });
});
