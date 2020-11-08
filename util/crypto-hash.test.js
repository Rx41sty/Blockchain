const cryptoHash = require("./crypto-hash")

describe("crypto-hash", () => {

	it("Check if it encrypts in sha 256", () => {
		expect(cryptoHash("foo")).toEqual("b2213295d564916f89a6a42455567c87c3f480fcd7a1c15e220f17d7169a790b");
	});

	it("Check if different arguments give same hash", () => {
		expect(cryptoHash("One", "Two", "Three")).toEqual(cryptoHash("Three", "Two", "One"));
	});

	it("Check if it produces different hash with same object but different properties", () => {
		let foo = {};

		const originalHash = cryptoHash(foo);

		foo["a"] = "a";

		expect(cryptoHash(foo)).not.toEqual(originalHash);

	});

});