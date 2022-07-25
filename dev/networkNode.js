const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const Blockchain = require('./blockchain')
const { v4: uuidv4 } = require('uuid')
// "start": "nodemon --watch dev -e js dev/api.js 3001"
const port = process.argv[2] // argument at index 2 is '3001'

const nodeAddress = uuidv4().split('-').join('')

const bitcoin = new Blockchain()

// If request comes in with:
// JSON data: parse application/json
app.use(bodyParser.json())

// or FORM data: parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// get entire blockchain
app.get('/blockchain', (req, res) => {
  res.send(bitcoin)
})

/**
 * Request body:
 * {
    "amount": 20,
    "sender": "QQABQQRT123123",
    "recipient": "CUONGWEOIJ23809"
}
 */
/* app.post('/transaction', (req, res) => {
  console.log(req.body)
  res.send(`This amount of transaction is ${req.body.amount} bitcoin.`)
  // TypeError: Cannot read properties of undefined (reading 'amount') -> install body-parser
})
 */

// create new transaction
app.post('/transaction', (req, res) => {
  const newTransaction = req.body
  const blockIndex = bitcoin.addTransactionToPendingTransactions(newTransaction)
  res.json({ note: `Transaction will be added in block ${blockIndex}` })
})

// mine a block
app.get('/mine', (req, res) => {
  const lastBlock = bitcoin.getLastBlock()
  const previousBlockHash = lastBlock['hash']
  const currentBlockData = {
    transactions: bitcoin.pendingTransactions,
    index: lastBlock['index'] + 1,
  }

  // search nonce for new block
  const nonce = bitcoin.proofOfWork(previousBlockHash)

  // generate hash for new block from above nonce
  const blockHash = bitcoin.hashBlock(
    previousBlockHash,
    currentBlockData,
    nonce
  )

  // mining reward
  bitcoin.createNewTransaction(12.5, '0', nodeAddress)

  // create new block
  const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash)

  res.json({
    note: 'New block mined successfully',
    block: newBlock,
  })
})

// register a node and broadcast it the network
app.post('/register-and-broadcast-node', (req, res) => {
  const newNodeUrl = req.body.newNodeUrl

  // check if new node in network nodes
  if (bitcoin.networkNodes.indexOf(newNodeUrl) == -1)
    bitcoin.networkNodes.push(newNodeUrl)
  
  // array of promise
  const regNodePromises = []

  bitcoin.networkNodes.forEach(networkNodeUrl => {
    // register to every node option
    const requestOptions = {
      uri: networkNodeUrl + '/register-node',
      method: 'POST',
      body: { newNodeUrl },
      json: true
    }

    // push each request promise into array
    regNodePromises.push(rp(requestOptions))
  })

  // handle register new node with all nodes in network, then return data
  Promise.all(regNodePromises)
  .then(data => {
    // using data
  })
})

// register a node with the network
app.post('/register-node', (req, res) => {})

// register multiple node at once
app.post('/register-and-bulk', (req, res) => {})

app.listen(port, () => {
  console.log(`Listening on port ${port}...`)
})
