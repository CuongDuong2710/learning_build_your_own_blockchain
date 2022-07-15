function Blockchain() {
  // constructor function
  this.chain = []
  this.newTransactions = []
}

Blockchain.prototype.createNewBlock = function (
  nonce,
  previousBlockHash,
  hash
) {
  const newBlock = {
    index: this.chain.length + 1, // block number
    timestamp: Date.now(),
    transactions: this.newTransactions,
    nonce, // proof
    hash,
    previousBlockHash,
  }

  this.newTransactions = []
  this.chain.push(newBlock)
}

module.exports = Blockchain