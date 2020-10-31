const INITIAL_DIFFICULTY = 3;
const MINE_RATE = 1000;

const GENESIS_DATA = {
    timestamp: "1",
    hash: "FirstHash",
    lasthash: "LastHash",
    difficulty: INITIAL_DIFFICULTY,
    nonce: 0,
    data: ["First", "Data"]
};


module.exports = {GENESIS_DATA, MINE_RATE};