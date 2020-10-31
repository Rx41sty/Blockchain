const Block = require("./block");
const {GENESIS_DATA, MINE_RATE} = require("./config")
const cryptoHash = require("./crypto-hash");

describe("Block", () => {

	const timestamp  = 2000;
	const hash       = "hash";
	const lasthash   = "lasthash";
	const data       = "data";
	const nonce      = 1;
	const difficulty = 1;

	const myblock = new Block({timestamp, lasthash, hash, data, nonce, difficulty});

	it("Values are properly set", () => {
		expect(myblock.timestamp).toEqual(timestamp);
		expect(myblock.lasthash).toEqual(lasthash);
		expect(myblock.hash).toEqual(hash);
		expect(myblock.data).toEqual(data);
		expect(myblock.nonce).toEqual(nonce);
		expect(myblock.difficulty).toEqual(difficulty);
	});

	describe("config", () =>{
		const genesis = Block.genesis();

		it("Genesis was imported", () => {
			expect(genesis instanceof Block).toBe(true);

		});

		it("Genesis block is ok", () => {
			expect(genesis).toEqual(GENESIS_DATA);

		});
	});

	describe("mineblock()", () => {

		const lastblock = Block.genesis();
		const data = "Block data";

		const minedBlock = Block.mineBlock({lastblock, data});

		it("Check if mined block is instance of Block", () => {
			expect(minedBlock instanceof Block).toBe(true);
		});

		it("Check if newly mined blocks lasthash is set", () => {
			expect(minedBlock.lasthash).toEqual(lastblock.hash);
		});

		it("Check if mined blocks time is set", () => {
			expect(minedBlock.timestamp).not.toEqual(undefined)
		});

		it("Sets SHA-256 based on the values given", () => {
			expect(minedBlock.hash).toEqual(cryptoHash(minedBlock.timestamp, minedBlock.nonce, minedBlock.difficulty, minedBlock.lasthash, data));
		});

		it("Sets hash that matches difficulty criteria", () => {
			expect(minedBlock.hash.substring(0, minedBlock.difficulty)).toEqual('0'.repeat(minedBlock.difficulty))
		});


	});


	describe("adjustDifficulty()", () => {

		it("Raises difficulty for quickly mined block", () => {
			expect(Block.adjustDifficulty({ originalBlock:myblock, timestamp: myblock.timestamp + MINE_RATE - 100 })).toEqual(myblock.difficulty + 1);
		});


		it("Lowers difficulty for slowly mined block", () => {
			expect(Block.adjustDifficulty({ originalBlock:myblock, timestamp: myblock.timestamp + MINE_RATE + 100 })).toEqual(myblock.difficulty - 1);
		});

		it("If difficulty becomes below 1 we return 1", () => {
			myblock.difficulty = -1;

			expect(Block.adjustDifficulty({originalBlock:myblock})).toEqual(1);

		});
	});

});


