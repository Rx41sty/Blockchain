const TransactionPool = require("./transaction-pool");
const Transaction = require("./transaction");
const Wallet = require("./index");
const BlockChain = require("../blockchain");
const { REWARD_INPUT, MINING_REWARD } = require("../config");

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

    describe("rewardTransaction()", () => {
        let minerWallet, newTransaction;

        beforeEach(() => {
            minerWallet = new Wallet();
            newTransaction = REWARD_INPUT;
            newTransaction = Transaction.rewardTransaction({ minerWallet });
        });

        it("Check if transaction was created", () => {
            expect(newTransaction).toHaveProperty("id");
        });

        it("Check if transaction was made", () => {
            expect(newTransaction.outputMap[minerWallet.publicKey]).toEqual(MINING_REWARD);
        });

        it("Check if input is set", () => {
            expect(newTransaction.input).toEqual(REWARD_INPUT);
        });
    });

    describe("clear", () => {
        it("clears the transactionpool", () => {
            transactionPool.setTransaction(transaction);
            transactionPool.clear();
    
            expect(transactionPool.transactionMap).toEqual({});
        });
    });

    describe("clearBlockchainTransactions()", () => {
        it("Check if transactions get deleted from tarnsactionpool", () => {
            let expectedTransactions = {};
            const blockchain = new BlockChain();

            for(let i = 0; i < 6; i++){
                transaction = new Wallet().createTransaction({ recipient: "fake", amount: 50 });

                if(i % 2 === 0){
                    blockchain.addBlock({ data: transaction });
                }else{
                    expectedTransactions[transaction.id] = transaction;
                }

                transactionPool.setTransaction(transaction);
            }
            
            transactionPool.clearBlockchainTransactions({ blockchain });

            expect(transactionPool.transactionMap).toEqual(expectedTransactions);
        });
    });
});