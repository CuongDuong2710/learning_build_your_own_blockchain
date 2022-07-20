const express = require('express')
const app = express()

app.get('/blockchain', (req, res) => {
})

app.post('/transaction', (req, res) => {
  res.send('It works!!!')
})

app.get('/mine', (req, res) => {

})

app.listen(3000, () => {
  console.log('Listening on port 3000...')
})