# Section 2: Building a Blockchain

## Run test

```sh
 $ node dev/test.js
```

One block has:

- index (block number)
- timestamp
- pending transactions (wait for verify). It will be pushed into next new block
- nonce (proof)
- hash
- previous block's hash

Genesic block does not have hash and previous block's hash

Using sha256 to generate block's hash

Proof of Work:

1.  Repeat hash block until it finds correct hash => '0000WRKWER9803KJLJBA'
2.  Use previousBlockHash, currentBlockData and nonce for generate hash
3.  Continue changes nonce until it finds correct hash
4.  Return nonce value that creates the correct hash

---

# Section 3: Accessing the Blockchain through an API

## Install Express

```sh
npm i express
```

## Run test

```sh
 $ node dev/api.js

 http://localhost:3000/
```

## Install Nodemon

> nodemon is a tool that helps develop Node.js based applications by automatically restarting the node application when file changes in the directory are detected.

```sh
npm i express
```

> "start": "nodemon --watch dev -e js dev/api.js"

- **watch** any file changes in **_dev_** folder
- **e** keep an eyes file is javascript (.js)
- automatically restarting **_dev/api.js_** file

```sh
npm start
```

## Install body-parser

> Node.js body parsing middleware.

> Parse incoming request bodies in a middleware before your handlers, available under the **_req.body_** property.

```sh
npm i body-parser
```

APIs

1. **GET/ blockchain**: get entire blockchain
2. **POST/ transaction**: receive new transaction information and add to pendingTransactions array
3. **GET/ mine**: mining a new block

Test

1. Run web to mine new block: http://localhost:3000/mine
2. Run http://localhost:3000/blockchain to check add new block into blockchain
3. Run postman **POST/ transaction** add some new pending transasction
4. Run /blockchain to see new pending transaction
5. Run mine to see new pending transaction is pushed into new block

Summary

1. Create some new transaction -> add into pending transaction
2. Mine new block -> some pending transaction will be pushed into new block
3. Check entire blockchain -> new block will be pushed into chain and pendingTransaction array is empty

---

# Section 4: Create a Decentralized Blockchain network

## change scripts run in package.json

```sh
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "node_1": "nodemon --watch dev -e js dev/networkNode.js 3001 http://localhost:3001/transaction",
    "node_2": "nodemon --watch dev -e js dev/networkNode.js 3002 http://localhost:3002/transaction",
    "node_3": "nodemon --watch dev -e js dev/networkNode.js 3003 http://localhost:3003/transaction",
    "node_4": "nodemon --watch dev -e js dev/networkNode.js 3004 http://localhost:3004/transaction",
    "node_5": "nodemon --watch dev -e js dev/networkNode.js 3005 http://localhost:3005/transaction"
  },
```

Get argument port in javascript at index 2

> const port = process.argv[2]

Run in multi cmd windows

```sh
npm run node_1

npm run node_2

npm run node_3

...
```

Create new pending transaction at Postman in node 1 (http://localhost:3001/transaction), node 3 (http://localhost:3003/transaction)

> These transactions is in private node, must decentralized by every node aware all transaction of all node

## Register and broadcast node

![Register and broadcast node](./assets/images/register_and_broadcast_node.jpg 'Register and broadcast node')

## Install request

> The simplified HTTP request client 'request' with Promise support. Powered by Bluebird.

```sh
npm install request --save
```

## Summary

Existing node: `Node 1`, `Node 2`, `Node 4`

New Node: `Node 3`

1. `Node 1` calls `register-and-broadcast-node` for new `Node 3` (`Node 1` has awared about new `Node 3`)
2. `Node 2` and `Node 4` calls `register-node` for awaring about new `Node 3`
3. After all, `Node 3` calls `register-nodes-bulk` for awaring all existing nodes in network

> All request options and uri is built in `Node 1`

---

# Section 5: Synchronizing the Network

All existing nodes need to aware new pending transaction and new mine block

![Transaction broadcast](./assets/images/section5_transaction_broadcast.jpg 'Transaction broadcast')

- Aware new pending transaction

1.  Current node add new transaction into pending transaction array
2.  Then current node will broadcast new transaction to all existing nodes in network
3.  All existing nodes will call `/transaction` POST to add new transation into pending transaction array
4.  All nodes have same new pending transaction datas.

- Aware new block is mined

1.  Node will create new block if it finds correct hash (proof of Work)
2.  Then node will request to all network nodes for receiving new block
3.  All existing nodes will call `/receive-new-block` to push new block into `this.chain`
4.  Then node winner will call `/transaction/broadcast` to broadcast for all network nodes about mining reward transaction to current node Address.
    But this transaction is into pending transaction array (memory pool)
5.  This transaction will be added `transactions` array into new another block

# Section 6: Consensus

`Consensus` is a way for all of the nodes inside of our network to agree upon what the correct data inside of the blockchain is.

So, for example, in the real world, when a block chain is totally built out, it is running across hundreds or thousands of nodes and every transaction and every block that's being created, `it's all broadcast to the entire block chain network`.

And there's a possibility that during these broadcasts, a hiccup could occur and maybe a `certain node doesn't receive a piece of information` or a transaction that took place.

Or even maybe there is `a bad actor inside of the block chain network` who is `sending out false information` or `creating fraudulent transactions` on their copy of the block chain and trying to broadcast them to the whole network and convince everybody that they are legitimate transactions.

> So how do we solve for this problem?

Our consensus algorithm will provide us with a way to `compare one node to all the other nodes inside of the network` to confirm that we have the correct data on the specific node.

We are going to create a consensus algorithm that implements `the longest chain rule`.

> So what is this longest chain rule?

It will simply compare the chain on the chosen node with all the other chains inside of our network, and `if one of the other chains has a longer length than the current node that we're on`, then we are simply going to `replace the chain of the node we are on with the longest chain in the network`.

The longest chain `has the most blocks` in it and `each of those blocks was mined by using a proof of work`.

![Consensus!](./assets/images/section6_consensus.jpg 'Consensus')

> Check chain is valid

1. Check each block has `hash` begin with `0000`
2. Check `previousBlockHash` in current block is equal with `hash of previous block`
3. Check data of `genesic block` is correct

> Test

1. Create test data (some block, some transactions)
2. Paste test data in dev/test.js
3. Run `node dev/test.js`
4. Attemp change data of `hash`, `address of recipient`, `genesic block`
5. Run test again `node dev/test.js`

![Consensus!](./assets/images/section6_consensus_2.jpg 'Consensus')

> Check consensus

1. Node 1, 2, 3, 4 are awaring in `networkNodes`
2. Mine some block and create some transactions
3. Synchonize all datas in network
4. Register and broadcast Node 5 in network
5. Run `/consensus` to update blockchain in Node 5
6. Run `/consensus` again, this chain of Node 5 has not been replaced

![Consensus!](./assets/images/section6_consensus_3.jpg 'Consensus')

# Section 7: Block explorer

1. Write `getBlock()` receives `blockHash` param to return correct block
2. Write `getTransaction()` receives `transactionId` param to return correct transaction and correct block
3. Write `getAddressData()` receives `address` param to return transactions and balace of this address

> Get Block by hash

![Block explorer!](./assets/images/section7_block_explorer.png 'Block explorer')

![Block explorer!](./assets/images/section7_block_explorer_2.png 'Block explorer')

> Get Transaction by Id

![Block explorer!](./assets/images/section7_block_explorer_3.png 'Block explorer')

![Block explorer!](./assets/images/section7_block_explorer_4.png 'Block explorer')

> Get address data by address

![Block explorer!](./assets/images/section7_block_explorer_5.png 'Block explorer')

![Block explorer!](./assets/images/section7_block_explorer_6.png 'Block explorer')
