const {GENESIS_DATA} = require("./config");
const cryptoHash = require("./crypto-hash");

class Block
{
  constructor({timestamp, hash, lasthash, data, nonce, difficulty}){
    this.timestamp  = timestamp;
    this.hash       = hash;
    this.lasthash   = lasthash;
    this.data       = data;
  	this.nonce      = nonce;
  	this.difficulty = difficulty; 
  }

  static genesis()
  {
  	return new Block(GENESIS_DATA);
  }

  static mineBlock({lastblock, data})
  {
  	let timestamp, hash;
  	//const timestamp = Date.now();
  	const lasthash  = lastblock.hash;
  	const { difficulty } = lastblock;

  	let nonce = 0;

  	do
  	{
  		nonce ++;
  		timestamp = Date.now();
  		hash = cryptoHash(timestamp, lasthash, data, nonce, difficulty);

  	}
  	while(hash.substring(0, difficulty) !== '0'.repeat(difficulty))

  	return new Block({timestamp, hash, lasthash, data, nonce, difficulty});
  }

}


module.exports = Block

