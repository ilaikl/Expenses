// Server setup
const express = require('express')
const app = express()
const api = require('./server/routes/api')
const expensesData = require('./expenses.json')

const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// Mongoose setup
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/expensesDB', { useNewUrlParser: true, useUnifiedTopology: true })

app.use('/', api)


// //Run Once
// const Expense = require('./server/model/Expense.js')
// // Expense.remove({}, function (err, people) {
// // })
// expensesData.forEach(e => {
//     let expense = new Expense(e)
//     expense.save()
// })




const port = 4200
app.listen(port, function () {
    console.log(`Running on port ${port}`)
})