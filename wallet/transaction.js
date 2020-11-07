const uuid = require("uuid/v1");
const { verifySignature } = require("../util");

class Transaction
{
    constructor({ senderWallet, recipient, amount })
    {
        this.id = new uuid();

        this.outputMap = this.createOutputMap({ senderWallet, recipient, amount});

        this.input = this.createInput({ senderWallet, amount });
    }

    createOutputMap({ senderWallet, recipient, amount})
    {
        let outputmap = {};
        outputmap[recipient] = amount;
        outputmap[senderWallet.publicKey] = senderWallet.balance - amount;
        return outputmap;
    }


    createInput({ senderWallet, amount })
    {
        return {
            timestamp: Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(this.outputMap)
        };
    }

    static validateTransaction(transaction)
    {
        const { input: { amount, address, signature }, outputMap } = transaction;

        const outputTotal = Object.values(outputMap).reduce((total, outputAmount) => total + outputAmount);
        
        if(outputTotal !== amount)
        {
            return false;
        }

        if(!verifySignature({ publicKey: address, data: outputMap, signature }))
        {
            return false;
        }
        return true;
    }
}


module.exports = Transaction;