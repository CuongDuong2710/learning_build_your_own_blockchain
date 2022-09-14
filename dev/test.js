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
 * ==================== Test hash function and proofOfWork =========================
 * 
 */
/* const previousBlockHash = 'QERAGFARE212379823'

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

const nonce = 100 */

// bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce)
// bitcoin.proofOfWork(previousBlockHash, currentBlockData)
// console.log(bitcoin.hashBlock(previousBlockHash, currentBlockData, 89935))

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

// hash function and proofOfWork
/* 
-- hashBlock --
dataAsString QERAGFARE212379823100[{"amount":10,"sender":"ALEIUOWEKJLZICUOZV23423","recipient":"CUONGKWJ39842093"},{"amount":20,"sender":"PAULUOWEKJLZICUOZV23423","recipient":"NGHIKWJ39842093"},{"amount":32,"sender":"KAKAIUOWEKJLZICUOZV23423","recipient":"TANKWJ39842093"}]

hash ace372b1b5d82b615e4b3303481801a314c24c43ade2a256893b96bad736191c 

-- Proof of work --
hash 0000a1341c510cdc585ba6116b626d5055c378532c378ec9f9e80b73b36d9c3e
nonce 89935
*/

/**
 * ==================== SECTION 6: CONSENSUS =========================
 */

const bc1 =
{
  "chain": [
      {
          "index": 1,
          "timestamp": 1663124543578,
          "transactions": [{}],
          "nonce": 100,
          "hash": "0",
          "previousBlockHash": "0"
      },
      {
          "index": 2,
          "timestamp": 1663125095755,
          "transactions": [],
          "nonce": 18140,
          "hash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100",
          "previousBlockHash": "0"
      },
      {
          "index": 3,
          "timestamp": 1663125268190,
          "transactions": [
              {
                  "amount": 12.5,
                  "sender": "00",
                  "recipient": "6a2c5b1affab49fea8ffab95aa54088f",
                  "transactionId": "661fdfe90d0f469b9062571508c730c8"
              },
              {
                  "amount": 10,
                  "sender": "JJJSAAAAHFW1239804123",
                  "recipient": "MYRRR8098WEOIJ23809",
                  "transactionId": "92d8d715c44d4822b9371627e4c89606"
              },
              {
                  "amount": 20,
                  "sender": "JJJSAAAAHFW1239804123",
                  "recipient": "MYRRR8098WEOIJ23809",
                  "transactionId": "72f13cd396f24a75baadcbaa4a1e7dd2"
              },
              {
                  "amount": 30,
                  "sender": "JJJSAAAAHFW1239804123",
                  "recipient": "MYRRR8098WEOIJ23809",
                  "transactionId": "66f0dac750594ab9883d50e0bfb490dc"
              }
          ],
          "nonce": 10126,
          "hash": "0000c4bd97be772b2d37df7fb795e5fea405bb0a005ad7945d3c12a002d7a0a5",
          "previousBlockHash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100"
      },
      {
          "index": 4,
          "timestamp": 1663125845957,
          "transactions": [
              {
                  "amount": 12.5,
                  "sender": "00",
                  "recipient": "6a2c5b1affab49fea8ffab95aa54088f",
                  "transactionId": "4c22cda68207402ba7048b2999a1d426"
              },
              {
                  "amount": 40,
                  "sender": "JJJSAAAAHFW1239804123",
                  "recipient": "MYRRR8098WEOIJ23809",
                  "transactionId": "a252a466c3194811b67f3760bca26503"
              },
              {
                  "amount": 50,
                  "sender": "JJJSAAAAHFW1239804123",
                  "recipient": "MYRRR8098WEOIJ23809",
                  "transactionId": "1bda9dd4388d4009951127596f5e6991"
              },
              {
                  "amount": 60,
                  "sender": "JJJSAAAAHFW1239804123",
                  "recipient": "MYRRR8098WEOIJ23809",
                  "transactionId": "07286b347d37413fb7bbf1c06ddac2ad"
              }
          ],
          "nonce": 76157,
          "hash": "000082cd809be66da90971a3eee31e29d1dec3d694ed23f1684ddfd5fcdf82f4",
          "previousBlockHash": "0000c4bd97be772b2d37df7fb795e5fea405bb0a005ad7945d3c12a002d7a0a5"
      },
      {
          "index": 5,
          "timestamp": 1663125863565,
          "transactions": [
              {
                  "amount": 12.5,
                  "sender": "00",
                  "recipient": "6a2c5b1affab49fea8ffab95aa54088f",
                  "transactionId": "b07e5970682347e480c8278a508a5bde"
              }
          ],
          "nonce": 80105,
          "hash": "00006861e3127f210089e5bf65bfa2a0f5dce533d51fda1e9bc47f9bd5faac36",
          "previousBlockHash": "000082cd809be66da90971a3eee31e29d1dec3d694ed23f1684ddfd5fcdf82f4"
      },
      {
          "index": 6,
          "timestamp": 1663125866302,
          "transactions": [
              {
                  "amount": 12.5,
                  "sender": "00",
                  "recipient": "6a2c5b1affab49fea8ffab95aa54088f",
                  "transactionId": "4a49cff28c3a4e74839b723e76510345"
              }
          ],
          "nonce": 36018,
          "hash": "000034cfd20b37ef7a6f1c4c6ea29e6117691b0d61245696dfcf251e3345a8f6",
          "previousBlockHash": "00006861e3127f210089e5bf65bfa2a0f5dce533d51fda1e9bc47f9bd5faac36"
      }
  ],
  "pendingTransactions": [
      {
          "amount": 12.5,
          "sender": "00",
          "recipient": "6a2c5b1affab49fea8ffab95aa54088f",
          "transactionId": "c6dc1b809d924c87b5b7cd4babe5cd7b"
      }
  ],
  "currentNodeUrl": "http://localhost:3001",
  "networkNodes": []
}

console.log('VALID: ', bitcoin.chainIsValid(bc1.chain))