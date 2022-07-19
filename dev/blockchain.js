function Blockchain() {
  // constructor function
  this.chain = []
  this.pendingTransactions = []
}

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
}

Blockchain.prototype.getLastBlock = function () {
  return this.chain[this.chain.length - 1]
}

Blockchain.prototype.createNewTransaction = function (
  amount,
  sender,
  recipient
) {
  const newTransaction = {
    amount,
    sender,
    recipient,
  }
  this.pendingTransactions.push(newTransaction)
  return this.getLastBlock()['index'] + 1 // return the number of block this new transaction will be added to (num 1: index 0, num 2: index 1, num 3: index 2)
}

module.exports = Blockchain
