const Wallet = require("./index");
const { verifySignature } = require("../util");
 
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


    describe("Signing", () => {

        it("Veirfy when signature is right", () => {
            const data = "foo";
            expect(
                verifySignature(
                    {
                        publicKey: wallet.publicKey,
                        data,
                        signature: wallet.sign(data)
                    }
                )
            ).toBe(true);
        });


        it("Dont verify when signayure is wrong", () => {

        });

    });

});