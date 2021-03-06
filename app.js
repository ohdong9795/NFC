const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

app.set('views',__dirname+'/views')
app.set('view engine','ejs')
app.engine('html', require('ejs').renderFile)

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())

var apiRouter = require('./routes/api')

app.use('/', apiRouter)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})