const redis = require('redis');

const CHANNEL = {
	TEST:"TEST",
	BLOCKCHAIN: "BLOCKCHAIN"
};


class PubSub
{
	constructor(blockchain)
	{
		this.blockchain = blockchain;
		this.subscriber = redis.createClient();
		this.publisher  = redis.createClient();

		this.subscribeToChannels();

		this.subscriber.on("message", (channel, message) => this.handleMessage(channel, message));
	}


	handleMessage(channel, message)
	{
		console.log("On channel " + channel + " Received message: " + message);

		const parsedChain = JSON.parse(message);

		if(channel === CHANNEL.BLOCKCHAIN)
		{
			this.blockchain.replaceChain(parsedChain);
		}
	}

	subscribeToChannels()
	{
		Object.values(CHANNEL).forEach(channel => 
		{
			this.subscriber.subscribe(channel);
		});
	}

	publish({channel, message})
	{
		this.publisher.publish(channel, message);
	}

	boadcastChain()
	{
		this.publish({channel: CHANNEL.BLOCKCHAIN, message: JSON.stringify(this.blockchain.chain)});
	}

}

module.exports = PubSub;