const Blockchain = require('./blockchain')

const bitcoin = new Blockchain()

/**
 * ===================== Test createNewBlock, createNewTransaction ========================
 * 
 */
// bitcoin.createNewBlock(56489, 'AAWETB989324', 'JK98092434')

// this transaction is push into pendingTransactions array
// bitcoin.createNewTransaction(10, 'ALEXWIULKJ9W8090', 'CUONGJOIUKJ809')

// create new block (number 2) and above transaction will be pushed into 'transactions' of block (number 2)
// bitcoin.createNewBlock(12212, 'TYWWYWYWN324', 'SHGFETY6856')

// console.log(bitcoin.chain[1])

/**
 * ==================== END =========================
 */

/**
 * ==================== Test hash function =========================
 * 
 */
const previousBlockHash = 'QERAGFARE212379823'

const currentBlockData = [
  {
    amount: 10,
    sender: 'ALEIUOWEKJLZICUOZV23423',
    recipient: 'CUONGKWJ39842093'
  },
  {
    amount: 20,
    sender: 'PAULUOWEKJLZICUOZV23423',
    recipient: 'NGHIKWJ39842093'
  },
  {
    amount: 32,
    sender: 'KAKAIUOWEKJLZICUOZV23423',
    recipient: 'TANKWJ39842093'
  }
]

const nonce = 100

bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce)

/**
 * ==================== END =========================
 */


/**
 * ==================== PRINT TEST RESULT =========================
 */

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

// hash function
/* dataAsString QERAGFARE212379823100[{"amount":10,"sender":"ALEIUOWEKJLZICUOZV23423","recipient":"CUONGKWJ39842093"},{"amount":20,"sender":"PAULUOWEKJLZICUOZV23423","recipient":"NGHIKWJ39842093"},{"amount":32,"sender":"KAKAIUOWEKJLZICUOZV23423","recipient":"TANKWJ39842093"}]

hash ace372b1b5d82b615e4b3303481801a314c24c43ade2a256893b96bad736191c */