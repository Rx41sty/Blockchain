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

    clearBlockchainTransactions({ chain }){
        for(let i = 0; i < chain.length; i++){
            let block = chain[i];
            for(let transaction of block.data){
                if(this.transactionMap[transaction.id]){
                    delete this.transactionMap[transaction.id];
                }
            }
        }

    }
}

module.exports = TransactionPool;