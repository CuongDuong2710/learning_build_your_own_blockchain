const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const Blockchain = require('./blockchain')

const bitcoin = new Blockchain()

// If request comes in with:
// JSON data: parse application/json
app.use(bodyParser.json())

// or FORM data: parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

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
app.post('/transaction', (req, res) => {
  console.log(req.body)
  res.send(`This amount of transaction is ${req.body.amount} bitcoin.`)
  // TypeError: Cannot read properties of undefined (reading 'amount') -> install body-parser
})

app.get('/mine', (req, res) => {})

app.listen(3000, () => {
  console.log('Listening on port 3000...')
})