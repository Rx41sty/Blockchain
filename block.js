const {GENESIS_DATA} = require("./config");
const cryptoHash = require("./crypto-hash");

class Block
{
  constructor({timestamp, hash, lasthash, data, nonse, difficulty}){
    this.timestamp  = timestamp;
    this.hash       = hash;
    this.lasthash   = lasthash;
    this.data       = data;
  	this.nonse      = nonse;
  	this.difficulty = difficulty; 
  }

  static genesis()
  {
  	return new Block(GENESIS_DATA);
  }

  static mineBlock({lastblock, data})
  {
  	const timestamp = Date.now();
  	const lasthash  = lastblock.hash;

  	return new Block({
  		timestamp,
  		hash: cryptoHash(timestamp, lasthash, data),
  		lasthash,
  		data

  	});
  }

}


module.exports = Block

