const express = require('express');
const Blockchain = require("./blockchain");


const app = express();
const blockchain = new Blockchain();


const PORT = 3000;

app.get("/api/blocks", (req, res) => {

	res.json(blockchain.chain);
});


app.listen(3000, () => console.log("Listening to port " + PORT));
