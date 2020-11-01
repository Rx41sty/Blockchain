const Block = require("./block")
const cryptoHash = require("./crypto-hash");

class Blockchain{

	constructor(){
		this.chain = [Block.genesis()];
	}

	addBlock({ data }){
		const newBlock = Block.mineBlock({
			lastblock: this.chain[this.chain.length-1], 
			data
			});

		this.chain.push(newBlock);
	}

	replaceChain(chain)
	{
		if(chain.length <= this.chain.length)
		{
			return;
		}

		if(!Blockchain.isValidChain(chain))
		{
			return;
		}


		this.chain = chain;
	}


	static isValidChain(chain)
	{
		if(JSON.stringify(Block.genesis()) !== JSON.stringify(chain[0]))
		{
			return false;
		}


		for(let i = 1; i < chain.length; i++)
		{
			const {timestamp, lasthash, hash, data, nonce, difficulty} = chain[i];

			const prevHash = chain[i-1].hash;

			if(Math.abs(chain[i-1].difficulty - chain[i].difficulty) > 1)
			{
				return false;
			}
			
			if(lasthash !== prevHash)
			{
				return false;
			}

			if(cryptoHash(timestamp, lasthash, data, nonce, difficulty) !== hash)
			{
				return false;
			}
		}

		return true;


	}

}



module.exports = Blockchain;