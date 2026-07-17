describe("User + Phone modules — /v1/user + /v1/phone", () => {
  let token: string;

  before(() => {
    cy.loginAsUser().then((res) => { token = res.token; });
  });

  // ── GET /user/profile ──
  describe("GET /user/profile", () => {
    it("returns profile with valid token", () => {
      cy.api({ method: "GET", url: "/user/profile", token }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.data).to.have.property("email");
        expect(res.body.data).to.not.have.property("password");
      });
    });
    it("returns 401 without token", () => {
      cy.request({ method: "GET", url: "/user/profile", failOnStatusCode: false }).then((res) => {
        expect(res.status).to.eq(401);
      });
    });
    it("returns 401 with malformed token", () => {
      cy.request({ method: "GET", url: "/user/profile", headers: { Authorization: "user invalidtoken" }, failOnStatusCode: false }).then((res) => {
        expect(res.status).to.eq(401);
      });
    });
  });

  // ── PUT /user/profile ──
  describe("PUT /user/profile", () => {
    it("updates phone number", () => {
      cy.api({ method: "PUT", url: "/user/profile", body: { phone: "+212600000001" }, token }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.data).to.have.property("phone", "+212600000001");
      });
    });
    it("rejects invalid phone format", () => {
      cy.api({ method: "PUT", url: "/user/profile", body: { phone: "abc" }, token }).then((res) => {
        expect(res.status).to.eq(400);
      });
    });
    it("returns 400 with no fields", () => {
      cy.api({ method: "PUT", url: "/user/profile", body: {}, token }).then((res) => {
        expect(res.status).to.eq(400);
      });
    });
    it("returns 401 without token", () => {
      cy.request({ method: "PUT", url: "/user/profile", body: { phone: "+212600000002" }, failOnStatusCode: false }).then((res) => {
        expect(res.status).to.eq(401);
      });
    });
  });

  // ── POST /user/upload-avatar ──
  describe("POST /user/upload-avatar", () => {
    it("returns 400 when no file provided", () => {
      cy.api({ method: "POST", url: "/user/upload-avatar", token }).then((res) => {
        expect(res.status).to.eq(400);
      });
    });
    it("returns 401 without token", () => {
      cy.request({ method: "POST", url: "/user/upload-avatar", failOnStatusCode: false }).then((res) => {
        expect(res.status).to.eq(401);
      });
    });
  });

  // ── POST /phone/send-otp ──
  describe("POST /phone/send-otp", () => {
    it("rejects invalid phone", () => {
      cy.api({ method: "POST", url: "/phone/send-otp", body: { phone: "abc" }, token }).then((res) => {
        expect(res.status).to.eq(400);
      });
    });
    it("accepts valid phone (may fail if Infobip unconfigured)", () => {
      cy.api({ method: "POST", url: "/phone/send-otp", body: { phone: "+212600000000" }, token }).then((res) => {
        expect([200, 500]).to.include(res.status);
      });
    });
    it("returns 401 without token", () => {
      cy.request({ method: "POST", url: "/phone/send-otp", body: { phone: "+212600000000" }, failOnStatusCode: false }).then((res) => {
        expect(res.status).to.eq(401);
      });
    });
  });

  // ── POST /phone/verify-otp ──
  describe("POST /phone/verify-otp", () => {
    it("rejects wrong otp", () => {
      cy.api({ method: "POST", url: "/phone/verify-otp", body: { phone: "+212600000000", otp: "000000" }, token }).then((res) => {
        expect(res.status).to.eq(400);
      });
    });
    it("rejects missing fields", () => {
      cy.api({ method: "POST", url: "/phone/verify-otp", body: {}, token }).then((res) => {
        expect(res.status).to.eq(400);
      });
    });
    it("returns 401 without token", () => {
      cy.request({ method: "POST", url: "/phone/verify-otp", body: { phone: "+212600000000", otp: "123456" }, failOnStatusCode: false }).then((res) => {
        expect(res.status).to.eq(401);
      });
    });
  });
});
