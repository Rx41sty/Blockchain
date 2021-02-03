const express = require('express');
const request = require('request');
const path = require('path');
const Blockchain = require("./blockchain");
const TransactionPool = require("./wallet/transaction-pool");
const PubSub = require("./app/pubsub");
const Wallet = require("./wallet");
const Transaction = require('./wallet/transaction');
const TransactionMiner = require("./app/transaction-miner");


const app = express();
const blockchain = new Blockchain();
const transactionPool = new TransactionPool();

const wallet = new Wallet();
const pubsub = new PubSub(blockchain, transactionPool);

const transactionMiner = new TransactionMiner({ blockchain, transactionPool, wallet, pubsub }); 

const ROOT_NODE_ADDRESS = "http://localhost:3000";

app.use(express.json());
app.use(express.static(path.join(__dirname, 'client')));

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
	
	let transaction = transactionPool.existingTransaction({ inputAddress: wallet.publicKey });

	try{
		if(transaction){
			transaction.update({ senderWallet: wallet, recipient, amount });
		}else{
			transaction = wallet.createTransaction({ recipient, amount, chain: blockchain.chain });
		}
	}catch(error){
		return res.status(400).json({type: 'error', message: 'Amount exceeds balance'});
	}

	transactionPool.setTransaction(transaction);

	pubsub.broadcastTransaction(transaction);

	res.json({type: 'success', transactionPool });
});


app.get("/api/transaction-pool-map", (req, res) => {
	res.json(transactionPool.transactionMap);
});

app.get("/api/mine-transactions", (req, res) => {
	transactionMiner.mineTransactions();

	res.redirect("/api/blocks");
});

app.get("/api/wallet-info", (req, res) => {
	const address = wallet.publicKey;

	res.json({address, balance: Wallet.calculateBalance({ chain:blockchain.chain, address })})
});

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, '/index.html'));
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

const syncTransaction = () => {
	request({url: "http://localhost:3000/api/transaction-pool-map"}, (error, response, body) => {
		if(!error && response.statusCode == 200)
		{
			const rootTransactionPool = JSON.parse(body);

			console.log("Sync to transaction pool ", rootTransactionPool);
			
			transactionPool.setMap(rootTransactionPool);
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
			syncTransaction();
		}
});
