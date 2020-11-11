class TransactionPool
{
    constructor(){
        this.transactionMap = {};
    }

    setTransaction(transaction)
    {
        this.transactionMap[transaction.id] = transaction;
    }

    existingTransaction({ inputAddress })
    {
        const values = Object.values(this.transactionMap);

        return values.find(trans => trans.input.address === inputAddress);
    }
}

module.exports = TransactionPool;