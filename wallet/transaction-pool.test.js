const TransactionPool = require("./transaction-pool");
const Transaction = require("./transaction");
const Wallet = require("./index");


describe("TransactionPool", () => {
    let transactionPool, transaction, senderWallet;
    

    beforeEach(() => {
        senderWallet = new Wallet();
        transaction = new Transaction({ senderWallet, recipient: "Fake-recipient", amount: 50 });
        transactionPool = new TransactionPool();
    });


    it("Check if transaction was added", () => {
        transactionPool.setTransaction(transaction);

        expect(transactionPool.transactionMap[transaction.id]).toBe(transaction);
    });

    it("existingTransaction()", () => {
        transactionPool.setTransaction(transaction);

        expect(transactionPool.existingTransaction({ inputAddress: senderWallet.publicKey })).toBe(transaction);
    });
});