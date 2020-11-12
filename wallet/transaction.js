const uuid = require("uuid/v1");
const { verifySignature } = require("../util");
const { MINING_REWARD, REWARD_INPUT } = require("../config");

class Transaction
{
    constructor({ senderWallet, recipient, amount, outputMap, input })
    {
        this.id = uuid();

        this.outputMap = outputMap || this.createOutputMap({ senderWallet, recipient, amount});

        this.input = input || this.createInput({ senderWallet, outputMap: this.outputMap });
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

    static rewardTransaction({ minerWallet }){
        return new this({ input: REWARD_INPUT, outputMap: { [minerWallet.publicKey]: MINING_REWARD }})
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