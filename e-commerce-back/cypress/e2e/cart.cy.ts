describe("Cart module — /v1/cart", () => {
  let token: string;

  before(() => {
    cy.loginAsUser().then((res) => { token = res.token; });
  });

  describe("POST /cart", () => {
    it("rejects non-existent product", () => {
      cy.api({ method: "POST", url: "/cart", body: { productId: 99999, quantity: 1 }, token, role: "user" }).then((res) => {
        expect(res.status).to.eq(404);
        expect(res.body.message).to.match(/not found/i);
      });
    });
    it("rejects quantity less than 1", () => {
      cy.api({ method: "POST", url: "/cart", body: { productId: 1, quantity: 0 }, token, role: "user" }).then((res) => {
        expect(res.status).to.eq(400);
      });
    });
    it("returns 401 without token", () => {
      cy.request({ method: "POST", url: "/cart", body: { productId: 1, quantity: 1 }, failOnStatusCode: false }).then((res) => {
        expect(res.status).to.eq(401);
      });
    });
    it("rejects admin role (user-only)", () => {
      cy.api({ method: "POST", url: "/cart", body: { productId: 1, quantity: 1 }, token, role: "admin" }).then((res) => {
        expect(res.status).to.eq(403);
      });
    });
  });

  describe("GET /cart", () => {
    it("returns cart for authenticated user", () => {
      cy.api({ method: "GET", url: "/cart", token, role: "user" }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.have.property("data");
      });
    });
    it("returns 401 without token", () => {
      cy.request({ method: "GET", url: "/cart", failOnStatusCode: false }).then((res) => {
        expect(res.status).to.eq(401);
      });
    });
    it("rejects admin role (user-only)", () => {
      cy.api({ method: "GET", url: "/cart", token, role: "admin" }).then((res) => {
        expect(res.status).to.eq(403);
      });
    });
  });

  describe("PUT /cart/:productId", () => {
    it("rejects non-existent product in cart", () => {
      cy.api({ method: "PUT", url: "/cart/99999", body: { quantity: 3 }, token, role: "user" }).then((res) => {
        expect(res.status).to.eq(404);
      });
    });
    it("returns 401 without token", () => {
      cy.request({ method: "PUT", url: "/cart/1", body: { quantity: 3 }, failOnStatusCode: false }).then((res) => {
        expect(res.status).to.eq(401);
      });
    });
  });

  describe("DELETE /cart/:productId", () => {
    it("rejects non-existent product in cart", () => {
      cy.api({ method: "DELETE", url: "/cart/99999", token, role: "user" }).then((res) => {
        expect(res.status).to.eq(404);
      });
    });
    it("returns 401 without token", () => {
      cy.request({ method: "DELETE", url: "/cart/1", failOnStatusCode: false }).then((res) => {
        expect(res.status).to.eq(401);
      });
    });
  });

  describe("DELETE /cart (clear all)", () => {
    it("clears the cart", () => {
      cy.api({ method: "DELETE", url: "/cart", token, role: "user" }).then((res) => {
        expect(res.status).to.eq(200);
      });
    });
    it("returns 401 without token", () => {
      cy.request({ method: "DELETE", url: "/cart", failOnStatusCode: false }).then((res) => {
        expect(res.status).to.eq(401);
      });
    });
  });
});
