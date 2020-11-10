const express = require('express');
const request = require('request');
const Blockchain = require("./blockchain");
const TransactionPool = require("./wallet/transaction-pool");
const PubSub = require("./app/pubsub");
const Wallet = require("./wallet");
const Transaction = require('./wallet/transaction');

const app = express();
const blockchain = new Blockchain();
const pubsub = new PubSub(blockchain);
const transactionPool = new TransactionPool();
const wallet = new Wallet();

const ROOT_NODE_ADDRESS = "http://localhost:3000";

app.use(express.json())

app.get("/api/blocks", (req, res) => {

	res.json(blockchain.chain);
});

app.post("/api/mine", (req, res) => {
	const { body } = req.body;

	blockchain.addBlock({body});

	res.redirect("/api/blocks");
});

app.post("/api/transact", (req, res) => {
	const {recipient, amount} = req.body;

	const transaction = new Transaction({ senderWallet: wallet, recipient, amount });
	transactionPool.setTransaction(transaction);

	console.log(transactionPool);

	res.json(transactionPool);
});


const syncChain = () => {
	request({url: "http://localhost:3000/api/blocks"}, (error, response, body) => {
		if(!error && response.statusCode == 200)
		{
			const rootChain = JSON.parse(body);

			console.log("Sync to chain ", rootChain);
			blockchain.replaceChain(rootChain);
		}

	});

};

const DEFAULT_PORT = 3000;
let ENV_PORT;

if(process.env.GENERATE_PEER_PORT === 'true')
{
	ENV_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}
const PORT = ENV_PORT || DEFAULT_PORT;


app.listen(PORT, () => {
		console.log("Listening to port " + PORT);

		if(PORT != DEFAULT_PORT)
		{
			syncChain();
		}
});
