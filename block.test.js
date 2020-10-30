const Block = require("./block");
const {GENESIS_DATA} = require("./config")
const cryptoHash = require("./crypto-hash");

describe("Block", () => {

	const timestamp = "01/01/01";
	const hash      = "hash";
	const lasthash  = "lasthash";
	const data      = "data";

	const myblock = new Block({timestamp, lasthash, hash, data});

	it("Values are properly set", () => {
		expect(myblock.timestamp).toEqual(timestamp);
		expect(myblock.lasthash).toEqual(lasthash);
		expect(myblock.hash).toEqual(hash);
		expect(myblock.data).toEqual(data);
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
			expect(minedBlock.hash).toEqual(cryptoHash(minedBlock.timestamp, minedBlock.lasthash, data));

		});
	});

});


