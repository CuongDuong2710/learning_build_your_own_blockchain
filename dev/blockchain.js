const uuid = require('uuid');
const sha256 = require('sha256')

function Blockchain() {
  // constructor function
  this.chain = []
  this.pendingTransactions = []

  // create Genesic block, not have previous block hash and self hash (do not proof of work)
  this.createNewBlock(100, '0', '0')
}

/**
 *
 * @param {*} nonce
 * @param {*} previousBlockHash
 * @param {*} hash
 */
Blockchain.prototype.createNewBlock = function (
  nonce,
  previousBlockHash,
  hash
) {
  const newBlock = {
    index: this.chain.length + 1, // block number
    timestamp: Date.now(),
    transactions: this.pendingTransactions,
    nonce, // proof
    hash,
    previousBlockHash,
  }

  this.pendingTransactions = []
  this.chain.push(newBlock)

  return newBlock
}

/**
 *
 * @returns
 */
Blockchain.prototype.getLastBlock = function () {
  return this.chain[this.chain.length - 1]
}

/**
 *
 * @param {*} amount
 * @param {*} sender
 * @param {*} recipient
 * @returns
 */
Blockchain.prototype.createNewTransaction = function (
  amount,
  sender,
  recipient
) {
  const newTransaction = {
    amount,
    sender,
    recipient,
    // transactionId: uuidv4().split('-').join(''),
  }
  this.pendingTransactions.push(newTransaction)
  return newTransaction
}

/**
 * Return the last block this new transaction will be added to (num 1: index 0, num 2: index 1, num 3: index 2)
 * @param {*} transactionObj
 * @returns
 */
Blockchain.prototype.addTransactionToPendingTransactions = function (
  transactionObj
) {
  this.pendingTransactions.push(transactionObj)
  return this.getLastBlock()['index'] + 1 // number of block
}
/**
 * 
 * @param {*} previousBlockHash 
 * @param {*} currentBlockData 
 * @param {*} nonce 
 * @returns 
 */
Blockchain.prototype.hashBlock = function (
  previousBlockHash,
  currentBlockData,
  nonce
) {
  const dataAsString =
    previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData)
  // console.log('dataAsString', dataAsString)
  const hash = sha256(dataAsString)
  return hash
}
/**
 * 1. Repeat hash block until it finds correct hash => '0000WRKWER9803KJLJBA'
 * 2. Use previousBlockHash, currentBlockData and nonce for generate hash
 * 3. Continue changes nonce until it finds correct hash
 * 4. Return nonce value that creates the correct hash
 * @param {*} previousBlockHash 
 * @param {*} currentBlockData 
 * @returns 
 */
Blockchain.prototype.proofOfWork = function(previousBlockHash, currentBlockData) {
  let nonce = 0
  let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce)
  while (hash.substring(0,4) !== '0000') {
    nonce++
    hash = this.hashBlock(previousBlockHash, currentBlockData, nonce)
  }
  console.log('hash', hash)
  console.log('nonce', nonce)
  return nonce
}

module.exports = Blockchain
