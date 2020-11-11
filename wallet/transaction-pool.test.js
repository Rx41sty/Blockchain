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

    describe("validtransactions()", () => {
        let validTransactions;

        beforeEach(() => {
            validTransactions = [];

            for(let i = 0; i < 10; i++){
                transaction = new Transaction({ senderWallet, recipient: "Fake-one", amount: 50 });

                if(i%3 === 0){
                    transaction.input.amount = 9999999;
                }else if(i%3 === 1){
                    transaction.input.signature = new Wallet().sign("Something");
                }
                else{
                    validTransactions.push(transaction);
                }

                transactionPool.setTransaction(transaction);
            }
        });

        it("Returns valid transactions", () => {
            expect(transactionPool.validTransactions()).toEqual(validTransactions);
        });


    });
});