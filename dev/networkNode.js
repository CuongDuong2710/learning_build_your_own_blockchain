const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const Blockchain = require('./blockchain')
const { v4: uuidv4 } = require('uuid')
const rp = require('request-promise')
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

/* --- TRANSACTION (Synchronizing the network) --- */

// create new transaction
app.post('/transaction', (req, res) => {
  const newTransaction = req.body
  console.log('/transaction >> newTransaction: ', newTransaction)
  const blockIndex = bitcoin.addTransactionToPendingTransactions(newTransaction)
  res.json({ note: `Transaction will be added in block ${blockIndex}` })
})

// broadcast transaction
app.post('/transaction/broadcast', (req, res) => {
  const { amount, sender, recipient } = req.body
  const newTransaction = bitcoin.createNewTransaction(amount, sender, recipient)
  // Step 1 - add pending transaction to current node
  bitcoin.addTransactionToPendingTransactions(newTransaction)

  // Step 2 - broadcast all existing node to add pending transaction
  const requestPromises = []
  bitcoin.networkNodes.forEach((networkNodeUrl) => {
    const requestOptions = {
      uri: networkNodeUrl + '/transaction',
      method: 'POST',
      body: newTransaction,
      json: true,
    }
    console.log('/transaction/broadcast >>> requestOptions: ', requestOptions)
    requestPromises.push(rp(requestOptions))
  })

  Promise.all(requestPromises).then((data) => {
    res.json({ note: 'Transaction created and broadcast successfully.' })
  })
})

/* --- MINING NEW BLOCK (Synchronizing the network) --- */

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

/* --- REGISTER NEW NODE (Creating a decentralized Blockchain) --- */

// Step 1. register a node and broadcast it the network
app.post('/register-and-broadcast-node', (req, res) => {
  const newNodeUrl = req.body.newNodeUrl
  console.log('Step 1. /register-and-broadcast-node')
  console.log('newNodeUrl: ', newNodeUrl)
  console.log('currentNodeUr: ', bitcoin.currentNodeUrl)

  // check if new node in network nodes
  if (bitcoin.networkNodes.indexOf(newNodeUrl) == -1) {
    bitcoin.networkNodes.push(newNodeUrl)
    console.log('networkNodes: ', bitcoin.networkNodes)
  }

  // array of promise
  const regNodePromises = []

  // Step 2. register new node with all nodes in network
  // all nodes aware about new node
  bitcoin.networkNodes.forEach((networkNodeUrl) => {
    const requestOptions = {
      uri: networkNodeUrl + '/register-node', // delegate every existing node call register-node
      method: 'POST',
      body: { newNodeUrl },
      json: true,
    }
    console.log('requestOptions: ', requestOptions)

    // push each request promise into array
    regNodePromises.push(rp(requestOptions))
  })

  // handle request then return data
  Promise.all(regNodePromises)
    .then((data) => {
      // Step 3. then register node bulk
      // new node awares about all exist nodes
      const bulkRegisterOptions = {
        uri: newNodeUrl + '/register-nodes-bulk', // delegate new node call register-nodes-bulk
        method: 'POST',
        body: {
          allNetworkNodes: [...bitcoin.networkNodes, bitcoin.currentNodeUrl],
        },
        json: true,
      }
      console.log('bulkRegisterOptions: ', bulkRegisterOptions)
      return rp(bulkRegisterOptions)
    })
    .then((data) => {
      res.json({ note: 'New node registered with network successfully.' })
      console.log('New node registered with network successfully.')
    })
})

// register a node with the network
app.post('/register-node', (req, res) => {
  console.log('Step 2. /register-node')
  const newNodeUrl = req.body.newNodeUrl
  const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(newNodeUrl) == -1
  const notCurrentNode = bitcoin.currentNodeUrl != newNodeUrl
  if (nodeNotAlreadyPresent && notCurrentNode) {
    bitcoin.networkNodes.push(newNodeUrl)
    console.log('networkNodes: ', bitcoin.networkNodes)
  }
  res.json({ note: 'New node registered successfully.' })
  console.log('New node registered successfully.')
})

// register multiple node at once
app.post('/register-nodes-bulk', (req, res) => {
  console.log('Step 3. /register-nodes-bulk')
  const allNetworkNodes = req.body.allNetworkNodes
  allNetworkNodes.forEach((networkNodeUrl) => {
    const nodeNotAlreadyPresent =
      bitcoin.networkNodes.indexOf(networkNodeUrl) == -1
    const notCurrentNode = bitcoin.currentNodeUrl != networkNodeUrl
    if (nodeNotAlreadyPresent && notCurrentNode) {
      bitcoin.networkNodes.push(networkNodeUrl)
      console.log('networkNodes: ', bitcoin.networkNodes)
    }
  })
  res.json({ note: 'Bulk registration successful.' })
  console.log('Bulk registration successful.')
})

/* --- REGISTER NEW NODE (Creating a decentralized Blockchain) --- */

app.listen(port, () => {
  console.log(`Listening on port ${port}...`)
})
