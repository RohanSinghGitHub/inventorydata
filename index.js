const express = require('express');
const mongoose = require('mongoose');
const inventoryData = require('./inventory')
const app = express();

app.use(express.json());



//mogodb connection
mongoose.connect("mongodb://localhost:27017/inventory", (err) => {
        console.log(err)
        if (!err) {
                console.log("db connected")
        }
        else {
                console.log("error")
        }
})



//routes
app.get("/", (req, res) => {
        res.send("backend works")
})

app.post("/addinventory", async (req, res) => {
        let x = await inventoryData.create({ productId: req.body.productId, quantity: req.body.quantity }).then((result) => {
                res.send(result)
        })
})

app.post("/updateqty", async (req, res) => {
        let requested = (req.body)
        let result = [];
        console.log(requested)
        for (let i = 0; i < requested.length; i++) {
                let item = requested[i].productId;
                let action = requested[i].operation;
                let qty = parseInt(requested[i].quantity);
                if (action == "add") {
                        //console.log(item)
                        let privqty = await inventoryData.findOne({ productId: item }).then((data) => {

                                inventoryData.findOneAndUpdate({ productId: data.productId }, { $set: { quantity: parseInt(data.quantity) + parseInt(qty) } }, { new: true }, function (err, doc) {
                                        if (err) {
                                                result.push("Productid: " + doc.productId + " not updated")
                                        }
                                        else {
                                                result.push("Productid: " + doc.productId + " updated")
                                        }
                                });

                        })
                }

                else if (action == "subtract") {

                        let privqty = await inventoryData.findOne({ productId: item }).then((data) => {

                                if (qty <= data.quantity) {
                                        inventoryData.findOneAndUpdate({ productId: data.productId }, { $set: { quantity: parseInt(data.quantity) - parseInt(qty) } }, { new: true }, function (err, doc) {
                                                if (err) {
                                                        result.push("Productid: " + doc.productId + " not updated")
                                                }
                                                else {
                                                        result.push("Productid: " + doc.productId + " updated")
                                                }
                                        });


                                }
                                else {
                                        console.log("quantity unavailable")
                                }
                        })
                }
        }
        res.send(result)
})

//port

app.listen(8000, (err) => {
        if (!err) {
                console.log("port started at 8000");
        }
        else {
                console.log(err)
        }
})


