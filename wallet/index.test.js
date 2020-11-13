const Wallet = require("./index");
const { verifySignature } = require("../util");
const BlockChain = require("../blockchain");
const { STARTING_BALANCE } = require("../config");

describe("Wallet", () => {
    let wallet;

    beforeEach(() => {
        wallet = new Wallet();
    });

    it("Has balance property", () => {
        expect(wallet).toHaveProperty("balance");
    });


    it("Has publicKey property", () => {
        expect(wallet).toHaveProperty("publicKey");
    });


    describe("Signing", () => {

        it("Veirfy when signature is right", () => {
            const data = "foo";
            expect(
                verifySignature(
                    {
                        publicKey: wallet.publicKey,
                        data,
                        signature: wallet.sign(data)
                    }
                )
            ).toBe(true);
        });
    });


    describe("and the chain is passed", () =>{
        it("It calls Wallet.CalculateBalance", () => {
            
            const mockCalculateBalance = jest.fn();
            const originalCalculateBalance = Wallet.calculateBalance;

            Wallet.calculateBalance = mockCalculateBalance;


            new Wallet().createTransaction({ recipient: "ad", amount:50, chain: new BlockChain()})

            expect(mockCalculateBalance).toHaveBeenCalled();

            Wallet.calculateBalance = originalCalculateBalance;
        });
    });


    describe("calculateBalance", () => {
        let blockChain;

        beforeEach(() => {
            blockChain = new BlockChain();
        });


        it("When wallet hasn't received/sent any amount", () =>{
            expect(Wallet.calculateBalance({  chain: blockChain.chain, address: wallet.publicKey })).toBe(STARTING_BALANCE);
        });

        describe("When wallet has received some amount", () => {
            let transactionOne, transactionTwo;

            beforeEach(() => {
                transactionOne = new Wallet().createTransaction({ recipient: wallet.publicKey, amount: 50 });
                transactionTwo = new Wallet().createTransaction({ recipient: wallet.publicKey, amount: 30 });

                blockChain.addBlock({ data: [transactionOne, transactionTwo] });
            });

            it("Transactions affected the wallet", () =>{
                expect(Wallet.calculateBalance({ chain: blockChain.chain, address: wallet.publicKey })).toBe(
                    STARTING_BALANCE + 
                    transactionOne.outputMap[wallet.publicKey] + 
                    transactionTwo.outputMap[wallet.publicKey])
            });
        });
    });

});