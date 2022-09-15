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
  // Step 1. Node will create new Block via proof of work

  const lastBlock = bitcoin.getLastBlock()
  const previousBlockHash = lastBlock['hash']
  const currentBlockData = {
    transactions: bitcoin.pendingTransactions,
    index: lastBlock['index'] + 1,
  }

  // search nonce for new block
  const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData)

  // generate hash for new block from above nonce
  const blockHash = bitcoin.hashBlock(
    previousBlockHash,
    currentBlockData,
    nonce
  )

  // create new block
  const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash)

  // Step 2. request to all network nodes for receiving new block
  const requestPromises = []
  bitcoin.networkNodes.forEach((networkNodeUrl) => {
    const requestOptions = {
      uri: networkNodeUrl + '/receive-new-block',
      method: 'POST',
      body: { newBlock },
      json: true,
    }
    console.log(
      `Receive new block - requestOptions: ${JSON.stringify(requestOptions)}`
    )
    requestPromises.push(rp(requestOptions))
  })

  // Step 4. Node winner broadcasts to all network nodes about mining reward to current node address
  Promise.all(requestPromises)
    .then((data) => {
      const requestOptions = {
        uri: bitcoin.currentNodeUrl + '/transaction/broadcast',
        method: 'POST',
        body: {
          amount: 12.5,
          sender: '00',
          recipient: nodeAddress,
        },
        json: true,
      }
      console.log(
        `Mining reward - requestOptions: ${JSON.stringify(requestOptions)}`
      )
      return rp(requestOptions)
    })
    .then((data) => {
      res.json({
        note: 'New block mined & broadcast successfully',
        block: newBlock,
      })
    })
})

// receive new block
app.post('/receive-new-block', (req, res) => {
  // Step 3. All existing nodes will call `/receive-new-block` to push new block into `this.chain`
  const newBlock = req.body.newBlock
  const lastBlock = bitcoin.getLastBlock()

  //  compare hash and index, new block comes right after the last block in our chain
  const correctHash = lastBlock.hash === newBlock.previousBlockHash
  const correctIndex = lastBlock['index'] + 1 === newBlock['index']

  if (correctHash && correctIndex) {
    // if true, chain add new block
    bitcoin.chain.push(newBlock) // bitcoin is current node calls api
    bitcoin.pendingTransactions = []
    res.json({
      note: 'New block received and accepted.',
      newBlock: newBlock,
    })
  } else {
    res.json({
      note: 'New block rejected.',
      newBlock: newBlock,
    })
  }
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

/* --- SECTION 6 - Consensus --- */

app.get('/consensus', (req, res) => {
  const requestPromises = []

  // Step 1. Make request to get all chains of all nodes
  bitcoin.networkNodes.forEach((networkNodeUrl) => {
    const requestOptions = {
      uri: networkNodeUrl + '/blockchain',
      method: 'GET',
      json: true,
    }
    requestPromises.push(rp(requestOptions))
  })

  Promise.all(requestPromises).then((blockchains) => {
    const currentChainLength = bitcoin.chain.length
    let maxChainLength = currentChainLength
    let newLongestChain = null
    let newPendingTransactions = null

    blockchains.forEach((blockchain) => {
      // Step 2. Compare current node to all the other nodes
      if (blockchain.chain.length > maxChainLength) {
        maxChainLength = blockchain.chain.length
        newLongestChain = blockchain.chain
        newPendingTransactions = blockchain.pendingTransactions
      }
    })

    // Step 3. Check newLongestChain is valid
    if (
      !newLongestChain ||
      (newLongestChain && !bitcoin.chainIsValid(newLongestChain))
    ) {
      // If newLongestChain is not valid, not replace
      res.json({
        note: 'Current chain has not been replaced.',
        chain: bitcoin.chain,
      })
    } else {
      // else if newLongestChain is valid, replace the chain of current node with the longest chain
      bitcoin.chain = newLongestChain
      bitcoin.pendingTransactions = newPendingTransactions
      res.json({
        note: 'This chain has been replaced.',
        chain: bitcoin.chain,
      })
    }
  })
})

/* --- SECTION 7 - Block explorer --- */

// get block by blockHash
app.get('/block/:blockHash', (req, res) => {
  const blockHash = req.params.blockHash
  const correctBlock = bitcoin.getBlock(blockHash)
  res.json({
    block: correctBlock
  })
})

// get transaction by transactionId
app.get('/transaction/:transactionId', (req, res) => {
  const transactionId = req.params.transactionId
  const transactionData = bitcoin.getTransaction(transactionId)
  res.json({
    transaction: transactionData.transaction,
    block: transactionData.block
  })
})

// get address's data by address
app.get('/address/:address', (req, res) => {
  const address = req.params.address
  const addressData = bitcoin.getAddressData(address)
  res.json({
    addressData
  })
})

app.get('/block-explorer', (req, res) => {
  res.sendFile('./block-explorer/index.html', { root: __dirname }) // root: root directory for relative filename
})

app.listen(port, () => {
  console.log(`Listening on port ${port}...`)
})
