const uuid = require("uuid/v1");


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
}


module.exports = Transaction;