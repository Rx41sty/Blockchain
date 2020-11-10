const TransactionPool = require("./transaction-pool");
const Transaction = require("./transaction");
const Wallet = require("./index");


describe("TransactionPool", () => {
    let transactionPool, transaction;
    

    beforeEach(() => {
        transaction = new Transaction({ senderWallet: new Wallet(), recipient: "Fake-recipient", amount: 50 });
        transactionPool = new TransactionPool();
    });


    it("Check if transaction was added", () => {
        transactionPool.setTransaction(transaction);

        expect(transactionPool.transactionMap[transaction.id]).toBe(transaction);
    });
});