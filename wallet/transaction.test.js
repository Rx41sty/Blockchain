const Transaction = require("./transaction");
const Wallet = require("./index");



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






});