const cryptoHash = require("../util/crypto-hash");
const Block = require("./block")
const Blockchain = require("./index")

describe("blockchain", () => {

	let blockchain;
	let newChain;
	let originalChain;

	beforeEach(() => {
		blockchain = new Blockchain();
		newChain = new Blockchain();

		originalChain = blockchain;
	});


	it("Contains a chain array instance", () => {
		expect(blockchain.chain instanceof Array).toBe(true); 
	});


	it("Starts with genesis block", () => {
		expect(blockchain.chain[0]).toEqual(Block.genesis());
	});


	it("Adds new block to the chain", () => {
		const data = "Some Data";
		blockchain.addBlock({ data });

		expect(blockchain.chain[blockchain.chain.length-1].data).toEqual(data);
	});


	describe("isValidChain()", () => {
		describe("When the chain doesn't start with the genesis block", () => {
			it("Return false", () => {
				blockchain.chain[0] = {data: "Modified data"};

				expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
			});
		});

		beforeEach(() => {
			blockchain.addBlock({data: "Dog"});
			blockchain.addBlock({data: "Cat"});
			blockchain.addBlock({data: "Dragon"});

		});

		describe("When the chain start with genesis block", () => {
			describe("And the lasthash has been changed", () => {
				it("returns false", () => {
					blockchain.chain[2].lasthash = "Changed-Hash";

					expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
				});
			});

			describe("And the chain contains block with invalid field", () => {
				it("returns false", () => {
					blockchain.chain[2].data = "Evil data";

					expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
				});
			});

			describe("And the chain doesn't contain any invalid blocks", () => {
				it("returns true", () => {
					expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
				});
			});

			describe("And the difficulty has been modified by user", () => {
				it("returns false", () => {
					const lasthash = blockchain.chain[blockchain.chain.length-1].hash;
					const timestamp = Date.now();
					const data = [];
					const nonce = 0;
					const difficulty = blockchain.chain[blockchain.chain.length-1].difficulty - 3;
					const hash = cryptoHash({lasthash, timestamp, data, nonce, difficulty});

					const newblock = new Block({timestamp, hash, lasthash, data, nonce, difficulty});

					blockchain.chain.push(newblock);

					expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);

				});
			});
		});
	});


	describe("replaceChain()", () => {

		describe("When new chain is not longer than current one", () => {

			it("Do not replace the chain", () => {
				newChain.chain[0] = {new: "chain"};

				blockchain.replaceChain(newChain.chain);
				expect(blockchain.chain).toEqual(originalChain.chain);
			});
		});


		describe("When new chain is longer than current one", () => {

			beforeEach(() => {
				newChain.addBlock({data: "Dog"});
				newChain.addBlock({data: "Cat"});
				newChain.addBlock({data: "Dragon"});

			});

			describe("And the chain is invalid", () => {

				it("Do not replace the chain", () => {
					newChain.chain[2].hash = "Invalid-hash";

					blockchain.replaceChain(newChain.chain);

					expect(blockchain.chain).toEqual(originalChain.chain);

				});

			});

			describe("And the chain is valid", () => {

				it("Replace the chain", () => {
					blockchain.replaceChain(newChain.chain);

					expect(blockchain.chain).toEqual(newChain.chain);

				});


			}); 


		});



	});


});