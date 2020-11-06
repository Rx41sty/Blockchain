const hexToBinary = require("hex-to-binary");
const { GENESIS_DATA, MINE_RATE} = require("../config");
const { cryptoHash } = require("../util");

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
  	const lasthash  = lastblock.hash;
  	
  	let timestamp, hash;
  	let { difficulty } = lastblock;
  	let nonce = 0;

  	do
  	{
  		nonce ++;
  		timestamp = Date.now();
  	
  		difficulty = Block.adjustDifficulty({originalBlock: lastblock, timestamp});
  		hash = cryptoHash(timestamp, lasthash, data, nonce, difficulty);
  	}
  	while(hexToBinary(hash).substring(0, difficulty) !== '0'.repeat(difficulty))

  	return new Block({timestamp, hash, lasthash, data, nonce, difficulty});
  }


  static adjustDifficulty({originalBlock, timestamp})
  {

  	if(originalBlock.difficulty < 1) return 1;

  	const diff = timestamp - originalBlock.timestamp;
  	
  	if (diff > MINE_RATE)
  	{
  		return originalBlock.difficulty - 1;
  	}

  	return originalBlock.difficulty + 1;
  }

}


module.exports = Block

