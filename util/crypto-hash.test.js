const cryptoHash = require("./crypto-hash")

describe("crypto-hash", () => {

	it("Check if it encrypts in sha 256", () => {
		expect(cryptoHash("foo")).toEqual("2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae");
	});

	it("Check if different arguments give same hash", () => {
		expect(cryptoHash("One", "Two", "Three")).toEqual(cryptoHash("Three", "Two", "One"));
	});

});