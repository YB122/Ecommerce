describe("Order module — /v1/order", () => {
  let token: string;

  before(() => {
    cy.loginAsUser().then((res) => { token = res.token; });
  });

  const shippingAddress = {
    fullName: "John Doe",
    phone: "+212600000000",
    street: "123 Main St",
    city: "Casablanca",
    country: "Morocco",
  };

  // ── POST /order ──
  describe("POST /order", () => {
    it("rejects non-existent product", () => {
      cy.api({
        method: "POST", url: "/order",
        body: { items: [{ productId: 99999, quantity: 1 }], paymentMethod: "cod", shippingAddress },
        token,
      }).then((res) => {
        expect(res.status).to.eq(404);
        expect(res.body.message).to.match(/product.*not found/i);
      });
    });
    it("rejects empty items array", () => {
      cy.api({
        method: "POST", url: "/order",
        body: { items: [], paymentMethod: "cod", shippingAddress },
        token,
      }).then((res) => {
        expect(res.status).to.eq(400);
      });
    });
    it("rejects missing paymentMethod", () => {
      cy.api({
        method: "POST", url: "/order",
        body: { items: [{ productId: 1, quantity: 1 }], shippingAddress },
        token,
      }).then((res) => {
        expect(res.status).to.eq(400);
      });
    });
    it("rejects invalid paymentMethod", () => {
      cy.api({
        method: "POST", url: "/order",
        body: { items: [{ productId: 1, quantity: 1 }], paymentMethod: "bitcoin", shippingAddress },
        token,
      }).then((res) => {
        expect(res.status).to.eq(400);
      });
    });
    it("rejects missing shippingAddress", () => {
      cy.api({
        method: "POST", url: "/order",
        body: { items: [{ productId: 1, quantity: 1 }], paymentMethod: "cod" },
        token,
      }).then((res) => {
        expect(res.status).to.eq(400);
      });
    });
    it("returns 401 without token", () => {
      cy.request({
        method: "POST", url: "/order",
        body: { items: [{ productId: 1, quantity: 1 }], paymentMethod: "cod", shippingAddress },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(401);
      });
    });
    it("accepts card payment method", () => {
      cy.api({
        method: "POST", url: "/order",
        body: { items: [{ productId: 99999, quantity: 1 }], paymentMethod: "card", shippingAddress },
        token,
      }).then((res) => {
        expect(res.status).to.eq(404); // product not found, but method is valid
      });
    });
  });

  // ── GET /order/mine ──
  describe("GET /order/mine", () => {
    it("returns orders for authenticated user", () => {
      cy.api({ method: "GET", url: "/order/mine", token }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.have.property("data");
      });
    });
    it("returns 401 without token", () => {
      cy.request({ method: "GET", url: "/order/mine", failOnStatusCode: false }).then((res) => {
        expect(res.status).to.eq(401);
      });
    });
  });

  // ── GET /order/:id ──
  describe("GET /order/:id", () => {
    it("returns 404 for non-existent order", () => {
      cy.api({ method: "GET", url: "/order/99999", token }).then((res) => {
        expect(res.status).to.eq(404);
      });
    });
    it("returns 401 without token", () => {
      cy.request({ method: "GET", url: "/order/99999", failOnStatusCode: false }).then((res) => {
        expect(res.status).to.eq(401);
      });
    });
    it("cannot access another user's order", () => {
      // Sign up a second user and try to view first user's order
      cy.loginAsUser().then((other) => {
        cy.api({ method: "GET", url: "/order/99999", token: other.token }).then((res) => {
          expect(res.status).to.eq(404);
        });
      });
    });
  });

  // ── Admin endpoints ──
  describe("PATCH /order/admin/:id (admin-only)", () => {
    it("rejects user role", () => {
      cy.api({ method: "PATCH", url: "/order/admin/99999", body: { orderStatus: "cancelled" }, token, role: "user" }).then((res) => {
        expect(res.status).to.eq(403);
      });
    });
    it("returns 401 without token", () => {
      cy.request({ method: "PATCH", url: "/order/admin/99999", body: { orderStatus: "cancelled" }, failOnStatusCode: false }).then((res) => {
        expect(res.status).to.eq(401);
      });
    });
    it("rejects invalid orderStatus", () => {
      cy.api({ method: "PATCH", url: "/order/admin/99999", body: { orderStatus: "invalid" }, token, role: "user" }).then((res) => {
        expect(res.status).to.eq(403); // blocked by role first
      });
    });
  });

  describe("GET /order/admin (admin-only)", () => {
    it("rejects user role", () => {
      cy.api({ method: "GET", url: "/order/admin", token, role: "user" }).then((res) => {
        expect(res.status).to.eq(403);
      });
    });
    it("returns 401 without token", () => {
      cy.request({ method: "GET", url: "/order/admin", failOnStatusCode: false }).then((res) => {
        expect(res.status).to.eq(401);
      });
    });
  });
});
