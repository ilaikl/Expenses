const express = require('express')
const router = express.Router()

const Expense = require('../model/Expense.js')
const moment = require('moment')

router.get('/expenses', function (req, res) {

    let d1 = req.query.d1
    let d2 = req.query.d2

    if (d1 && d2) {
        d1 = moment(d1).format('LLLL')
        d2 = moment(d2).format('LLLL')
        Expense.find({ $and: [{ date: { $gte: d1 } }, { date: { $lte: d2 } }] }, function (err, exes) {
            res.send(exes)
        }).sort({ date: -1 })
    } else if (d1) {
        d1 = moment(d1).format('LLLL')
        Expense.find({ date: { $gte: d1 }  }, function (err, exes) {
            res.send(exes)
        }).sort({ date: -1 })
    } else if (d2) {
        d2 = moment(d2).format('LLLL') 
        Expense.find({ date: { $lte: d2 }  }, function (err, exes) {
            res.send(exes)
        }).sort({ date: -1 })
        
    } else {
        Expense.find({}, function (err, exes) {
            res.send(exes)
        }).sort({ date: -1 })
    }
})

router.post('/new', function (req, res) {
    let date = moment().format('LLLL')
    if (req.body.date) {
        date = moment(req.body.date).format('LLLL')
    }

    let item = req.body.name || req.body.item || ""

    let expense = new Expense({ amount: req.body.amount, group: req.body.group, date: date, item: item })

    let savedExpense = expense.save()

    savedExpense.then(function () {
        Expense.find({ item: item }, function (err, exp) {
            console.log("You spent " + exp[0].amount + " on " + exp[0].item)
        })
    })
    res.end()
})


router.put('/update/:group1/:group2', function (req, res) {
    let group1 = req.params.group1
    let group2 = req.params.group2


    Expense.findOneAndUpdate({ group: group1 }, { $set: { group: group2 } }, { new: true }).exec(function (err, result) {
        if (err) return handleError(err)
        res.send({ group: result.group, name: result.item })
    })

})

router.get('/expenses/:group', function (req, res) {
    let total = req.query.total
    let group = req.params.group
    if (total == 'true') {
        Expense.aggregate([
            { "$match": { "group": group } },
            {
                $group:
                {
                    _id: '$group',
                    'TotalAmount': { $sum: "$amount" }
                }
            }
        ]).exec((err, exes) => {
            if (err) throw err;
            res.send(exes)
        })
    } else {
        Expense.find({ group: group }, function (err, exes) {
            res.send(exes)
        })
    }


})


// router.delete('/apocalypse', function (req, res) {

//     Person.remove({}, function (err, people) {
//         console.log(people)
//     })
//     res.end()
// })

module.exports = router