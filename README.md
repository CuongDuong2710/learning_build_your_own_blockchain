## Run test
> $ node dev/test.js

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