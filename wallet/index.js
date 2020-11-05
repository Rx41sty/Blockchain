const { STARTING_BALANCE } = require("../config");
const { ec } = require("../util");

class Wallet
{
    constructor()
    {
        this.balance = STARTING_BALANCE;

        const keypair = ec.genKeyPair();

        this.publicKey = keypair.getPublic().encode("hex");
    }
}

module.exports = Wallet;