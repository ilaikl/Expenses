const mongoose = require('mongoose')
const Schema = mongoose.Schema

const expenseSchema = new Schema({
    amount: Number,
    group: String,
    date: Date,
    item: String
})

const Expense = mongoose.model("expense", expenseSchema)
module.exports = Expense