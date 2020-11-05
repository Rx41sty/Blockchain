const Wallet = require("./index");

describe("Wallet", () => {
    let wallet;

    beforeEach(() => {
        wallet = new Wallet();
    });

    it("Has balance property", () => {
        expect(wallet).toHaveProperty("balance");
    });


    it("Has publicKey property", () => {
        expect(wallet).toHaveProperty("publicKey");
    });

});