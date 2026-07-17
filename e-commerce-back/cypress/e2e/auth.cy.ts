describe("Auth module — /v1/auth", () => {
  const email = `auth_${Date.now()}@test.com`;
  const password = "Secure123!";

  // ── POST /signup ──
  describe("POST /auth/signup", () => {
    it("creates a new user", () => {
      cy.signup(email, password).then((res) => {
        expect(res.status).to.eq(201);
        expect(res.body.message).to.match(/verification email sent/i);
      });
    });
    it("rejects duplicate email", () => {
      cy.signup(email, password).then((res) => {
        expect(res.status).to.eq(400);
        expect(res.body.message).to.match(/already exists/i);
      });
    });
    it("rejects missing required fields", () => {
      cy.request({ method: "POST", url: "/auth/signup", body: {}, failOnStatusCode: false }).then((res) => {
        expect(res.status).to.eq(400);
      });
    });

    it("rejects weak password (too short)", () => {
      cy.signup(`weak_${Date.now()}@test.com`, "12").then((res) => {
        expect(res.status).to.eq(400);
      });
    });
  });

  // ── POST /login ──
  describe("POST /auth/login", () => {
    it("logs in with valid credentials", () => {
      cy.login(email, password).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.have.property("accessToken");
        expect(res.body).to.have.property("refreshToken");
        expect(res.body.message).to.match(/login successful/i);
      });
    });
    it("rejects wrong password", () => {
      cy.login(email, "wrongpassword").then((res) => {
        expect(res.status).to.eq(400);
        expect(res.body.message).to.match(/invalid/i);
      });
    });
    it("rejects non-existent email", () => {
      cy.login("nobody@test.com", password).then((res) => {
        expect(res.status).to.eq(400);
      });
    });
    it("rejects missing body", () => {
      cy.request({ method: "POST", url: "/auth/login", body: {}, failOnStatusCode: false }).then((res) => {
        expect(res.status).to.eq(400);
      });
    });
  });

  // ── GET /verify-email/:token ──
  describe("GET /auth/verify-email/:token", () => {
    it("returns error for invalid token", () => {
      cy.request({ method: "GET", url: "/auth/verify-email/badtoken", failOnStatusCode: false }).then((res) => {
        expect(res.status).to.eq(400);
        expect(res.body.message).to.match(/invalid|expired/i);
      });
    });
  });

  // ── POST /resend-verify-email ──
  describe("POST /auth/resend-verify-email (rate limited)", () => {
    it("rejects non-existent email", () => {
      cy.request({ method: "POST", url: "/auth/resend-verify-email", body: { email: "nobody@test.com" }, failOnStatusCode: false }).then((res) => {
        expect(res.status).to.eq(400);
      });
    });
  });

  // ── POST /forgot-password ──
  describe("POST /auth/forgot-password", () => {
    it("accepts valid email", () => {
      cy.request({ method: "POST", url: "/auth/forgot-password", body: { email }, failOnStatusCode: false }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.message).to.match(/reset/i);
      });
    });
    it("rejects non-existent email", () => {
      cy.request({ method: "POST", url: "/auth/forgot-password", body: { email: "nobody@test.com" }, failOnStatusCode: false }).then((res) => {
        expect(res.status).to.eq(400);
      });
    });
  });

  // ── POST /reset-password/:token ──
  describe("POST /auth/reset-password/:token", () => {
    it("rejects invalid token", () => {
      cy.request({ method: "POST", url: "/auth/reset-password/badtoken", body: { password: "NewPass123!", confirmPassword: "NewPass123!" }, failOnStatusCode: false }).then((res) => {
        expect(res.status).to.eq(400);
        expect(res.body.message).to.match(/invalid|expired/i);
      });
    });
  });

  // ── GET /google/signup + /google/login (redirect) ──
  describe("GET /auth/google/signup", () => {
    it("redirects to Google", () => {
      // Cypress follows redirects by default; just confirm it's a redirect
      cy.request({ method: "GET", url: "/auth/google/signup", failOnStatusCode: false }).then((res) => {
        expect(res.status).to.eq(302);
      });
    });
    it("returns 302 with role query param", () => {
      cy.request({ method: "GET", url: "/auth/google/signup?role=admin", failOnStatusCode: false }).then((res) => {
        expect(res.status).to.eq(302);
      });
    });
  });

  describe("GET /auth/google/login", () => {
    it("redirects to Google", () => {
      cy.request({ method: "GET", url: "/auth/google/login", failOnStatusCode: false }).then((res) => {
        expect(res.status).to.eq(302);
      });
    });
  });
});
