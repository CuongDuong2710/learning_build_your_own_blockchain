const Blockchain = require('./blockchain')

const bitcoin = new Blockchain()

bitcoin.createNewBlock(56489, 'AAWETB989324', 'JK98092434')

// this transaction is push into pendingTransactions array
bitcoin.createNewTransaction(10, 'ALEXWIULKJ9W8090', 'CUONGJOIUKJ809')

// create new block (number 2) and above transaction will be pushed into 'transactions' of block (number 2)
bitcoin.createNewBlock(12212, 'TYWWYWYWN324', 'SHGFETY6856')

console.log(bitcoin.chain[1])

// Emtpy block
// Blockchain { chain: [], pendingTransactions: [] }

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
    },
    {
      index: 2,
      timestamp: 1658138358262,
      transactions: [Array],
      nonce: 12212,
      hash: 'SHGFETY6856',
      previousBlockHash: 'TYWWYWYWN324'
    }
  ],
  pendingTransactions: []
} */

// console.log(bitcoin.chain[1])
/* {
  index: 2,
  timestamp: 1658133155037,
  transactions: [
    {
      amount: 10,
      sender: 'ALEXWIULKJ9W8090',
      recipient: 'CUONGJOIUKJ809'
    }
  ],
  nonce: 12212,
  hash: 'SHGFETY6856',
  previousBlockHash: 'TYWWYWYWN324'
} */