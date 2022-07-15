const Blockchain = require('./blockchain')

const bitcoin = new Blockchain()

bitcoin.createNewBlock(56489, 'AAWETB989324', 'JK98092434')

console.log(bitcoin)

// Emtpy block
// Blockchain { chain: [], newTransactions: [] }

// Have parameter
/* Blockchain {
  chain: [
    {
      index: 1,
      timestamp: 1657873656975,
      transactions: [],
      nonce: 56489,
      hash: 'JK98092434',
      previousBlockHash: 'AAWETB989324'
    }
  ],
  newTransactions: []
} */
