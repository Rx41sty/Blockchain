const Transaction = require("./transaction");
const Wallet = require("./index");
const { verifySignature } = require("../util");


describe("Transaction", () => {

    let transaction, senderWallet, recipient, amount;

    beforeEach(() => {
        senderWallet = new Wallet();
        recipient = "reciepent-public-key";
        amount = 50;

        transaction = new Transaction({ senderWallet, recipient, amount});
    });


    it("Has an id", () => {
        expect(transaction).toHaveProperty("id");
    });

    describe("ouputMap", () => {
        it("Expect outputmap[recipient] to equal to amount transfered", () => {
            expect(transaction.outputMap[recipient]).toEqual(amount);
        });


        it("Output remaining balance of sender", () => {
            expect(transaction.outputMap[senderWallet.publicKey]).toEqual(senderWallet.balance - amount);
        });
    });


    describe("Input", () => {

        it("Has input field", () => {
            expect(transaction).toHaveProperty("input");
        });

        it("Has timestamp in input", () => {
            expect(transaction.input).toHaveProperty("timestamp");
        });

        it("sets amount to senderwallet balance", () => {
            expect(transaction.input.amount).toEqual(senderWallet.balance);
        });

        it("sets address to senderwallet public key", () => {
            expect(transaction.input.address).toEqual(senderWallet.publicKey);
        });

        it("sign the input", () => {
            expect(
                verifySignature({
                    publicKey: senderWallet.publicKey,
                    data: transaction.outputMap,
                    signature: transaction.input.signature
                })
            ).toBe(true);
        });
    });






});