const { v4: uuidv4 } = require('uuid')
const sha256 = require('sha256')
const currentNodeUrl = process.argv[3]

function Blockchain() {
  // constructor function
  this.chain = []
  this.pendingTransactions = []

  this.currentNodeUrl = currentNodeUrl
  this.networkNodes = []

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
    transactionId: uuidv4().split('-').join(''),
  }
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
Blockchain.prototype.proofOfWork = function (
  previousBlockHash,
  currentBlockData
) {
  let nonce = 0
  let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce)
  while (hash.substring(0, 4) !== '0000') {
    nonce++
    hash = this.hashBlock(previousBlockHash, currentBlockData, nonce)
  }
  console.log('hash', hash)
  console.log('nonce', nonce)
  return nonce
}

/* --- SECTION 6 - Consensus --- */

Blockchain.prototype.chainIsValid = function (blockchain) {
  let validChain = true

  for (var i = 1; i < blockchain.length; i++) {
    const currentBlock = blockchain[i]
    const prevBlock = blockchain[i - 1]
    const currentBlockData = {
      transactions: currentBlock['transactions'],
      index: currentBlock['index'],
    }

    const blockHash = this.hashBlock(
      prevBlock['hash'],
      currentBlockData,
      currentBlock['nonce']
    )

    if (blockHash.substring(0, 4) !== '0000') validChain = false
    if (currentBlock['previousBlockHash'] !== prevBlock['hash'])
      validChain = false
  }

  const genesicBlock = blockchain[0]
  const correctNonce = genesicBlock['nonce'] === 100
  const correctPreviousBlockHash = genesicBlock['previousBlockHash'] === '0'
  const correctHash = genesicBlock['hash'] === '0'
  const correctTransactions = genesicBlock['transactions'].length === 0

  if (
    !correctNonce ||
    !correctPreviousBlockHash ||
    !correctHash ||
    !correctTransactions
  )
    validChain = false

  return validChain
}

/* --- SECTION 7 - Block explorer --- */

Blockchain.prototype.getBlock = function (blockHash) {
  let correctBlock = null

  this.chain.forEach((block) => {
    if (block['hash'] === blockHash) {
      correctBlock = block
    }
  })

  return correctBlock
}

Blockchain.prototype.getTransaction = function (transactionId) {
  let correctTransaction = null
  let correctBlock = null

  this.chain.forEach((block) => {
    block.transactions.forEach((transaction) => {
      if (transaction.transactionId === transactionId) {
        correctTransaction = transaction
        correctBlock = block
      }
    })
  })

  return { transaction: correctTransaction, block: correctBlock }
}

Blockchain.prototype.getAddressData = function (address) {
  const addressTransactions = []
  let balance = 0

  this.chain.forEach(block => {
    block.transactions.forEach(transaction => {
      if (transaction.sender === address || transaction.recipient === address) {
        addressTransactions.push(transaction)
      }
    })
  })

  addressTransactions.forEach(transaction => {
    if (transaction.recipient === address) {
      balance += transaction.amount
    } else if (transaction.sender === address) {
      balance -= transaction.amount
    }
  })

  return {
    addressTransactions,
    balance
  }
}


module.exports = Blockchain
