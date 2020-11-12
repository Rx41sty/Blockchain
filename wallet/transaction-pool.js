const Transaction = require("./transaction");

class TransactionPool
{
    constructor(){
        this.transactionMap = {};
    }

    clear(){
        this.transactionMap = {};
    }

    setTransaction(transaction)
    {
        this.transactionMap[transaction.id] = transaction;
    }

    setMap(transactionMap){
        this.transactionMap = transactionMap;
    }

    existingTransaction({ inputAddress })
    {
        const values = Object.values(this.transactionMap);

        return values.find(trans => trans.input.address === inputAddress);
    }

    validTransactions(){
        return Object.values(this.transactionMap).filter(transaction => Transaction.validateTransaction(transaction));
    }

    clearBlockchainTransactions({ blockchain }){
        for(let transaction of Object.values(blockchain.chain)){
            if(this.transactionMap[transaction.data.id]){
                delete this.transactionMap[transaction.data.id];
            }
        }
    }
}

module.exports = TransactionPool;