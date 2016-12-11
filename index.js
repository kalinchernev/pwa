var express = require('express')
var app = express()

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT, () => {
  console.log(`App running at port ${process.env.PORT}`);
})
