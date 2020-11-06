const { STARTING_BALANCE } = require("../config");
const { ec } = require("../util");
const cryptoHash = require("../util/crypto-hash");

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
}

module.exports = Wallet;