# Section 1: Building a Blockchain
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
 1. Repeat hash block until it finds correct hash => '0000WRKWER9803KJLJBA'
 2. Use previousBlockHash, currentBlockData and nonce for generate hash
 3. Continue changes nonce until it finds correct hash
 4. Return nonce value that creates the correct hash

---

# Section 2: Accessing the Blockchain through an API
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

- **watch** any file changes in ***dev*** folder
- **e** keep an eyes file is javascript (.js) 
- automatically restarting ***dev/api.js*** file

```sh
npm start
```
## Install body-parser
> Node.js body parsing middleware.

> Parse incoming request bodies in a middleware before your handlers, available under the ***req.body*** property.

```sh
npm i body-parser
```