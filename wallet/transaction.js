const uuid = require("uuid/v1");
const { verifySignature } = require("../util");

class Transaction
{
    constructor({ senderWallet, recipient, amount })
    {
        this.id = new uuid();

        this.outputMap = this.createOutputMap({ senderWallet, recipient, amount});

        this.input = this.createInput({ senderWallet, outputMap: this.outputMap });
    }

    createOutputMap({ senderWallet, recipient, amount})
    {
        let outputmap = {};
        outputmap[recipient] = amount;
        outputmap[senderWallet.publicKey] = senderWallet.balance - amount;
        return outputmap;
    }


    createInput({ senderWallet, outputMap })
    {
        return {
            timestamp: Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(outputMap)
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


    update({ senderWallet, recipient, amount })
    {
        if(amount > senderWallet.balance)
        {
            throw new Error("Amount exceeds balance");
        }

        if(!this.outputMap[recipient])
        {
            this.outputMap[recipient] = amount;
        }
        else
        {
            this.outputMap[recipient] += amount;
        }

        

        this.outputMap[senderWallet.publicKey] = this.outputMap[senderWallet.publicKey] - amount;

        this.input = this.createInput({ senderWallet, outputMap: this.outputMap });
    }
}


module.exports = Transaction;