const uuid = require("uuid/v1");


class Transaction
{
    constructor({ senderWallet, recipient, amount })
    {
        this.id = new uuid();

        this.outputMap = this.createOutputMap({ senderWallet, recipient, amount});
    }



    createOutputMap({ senderWallet, recipient, amount})
    {
        let outputmap = {};
        outputmap[recipient] = amount;
        outputmap[senderWallet.publicKey] = senderWallet.balance - amount;

        return outputmap;
    }
}


module.exports = Transaction;