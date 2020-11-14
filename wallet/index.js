const { STARTING_BALANCE } = require("../config");
const { ec, cryptoHash } = require("../util");
const Transaction = require("./transaction");

class Wallet
{
    constructor()
    {
        this.balance = STARTING_BALANCE;

        this.keypair = ec.genKeyPair();

        this.publicKey = this.keypair.getPublic().encode("hex");
    }

    sign(data)
    {
        return this.keypair.sign(cryptoHash(data));
    }

    createTransaction({ recipient, amount, chain })
    {
        if(chain){
            this.balance = Wallet.calculateBalance({ chain, address: this.publicKey });
        }

        if(amount > this.balance)
        {
            throw new Error("Amount exceeds balance");
        }

        return new Transaction({ senderWallet: this, recipient, amount });
    }


    static calculateBalance({ chain, address }){
        let outputBalance = 0;
        let inputAddress = false;
            for(let i = chain.length - 1; i > 0; i--){
                let block = chain[i];
                for(let transaction of block.data)
                {
                    if(transaction.input.address === address){
                        inputAddress = true;
                    }
                    let outputMapBalance = transaction.outputMap[address];
                        
                    if(outputMapBalance){
                        outputBalance = outputBalance + outputMapBalance;
                    }
                }

                if(inputAddress){
                    break;
                }
            }
        return inputAddress ? outputBalance: STARTING_BALANCE + outputBalance;
    }
}

module.exports = Wallet;