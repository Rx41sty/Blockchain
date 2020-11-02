const express = require('express');
const Blockchain = require("./blockchain");
const PubSub = require("./pubsub");

const app = express();
const blockchain = new Blockchain();
const pubsub = new PubSub(blockchain);

setTimeout(() => pubsub.boadcastChain(), 1000);

app.use(express.json())

const PORT = 3000;

app.get("/api/blocks", (req, res) => {

	res.json(blockchain.chain);
});

app.post("/api/mine", (req, res) => {
	const { body } = req.body;

	blockchain.addBlock({body});

	res.redirect("/api/blocks");
});


app.listen(3000, () => console.log("Listening to port " + PORT));
