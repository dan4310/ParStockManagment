const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json())
app.use(cors());

const mysql = require('mysql');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Jhonjhon4310',
    database: 'ParStockData'
});

app.post("/addItem", (req, res) => {
    const name = req.body.name;
    const par = req.body.par;
    const email = req.body.email;
    const stock = req.body.stock;
    const weeklyUsage = req.body.weeklyUsage;
    const price = req.body.price;

    db.query("INSERT INTO items (name, par, email, stock, weeklyUsage, price) VALUES (?, ?, ?, ?, ?, ?);",
    [name, par, email, stock, weeklyUsage, price],
    (err, result) => {
        if (err) {
            console.log(err);
            res.send({ success: false });
        } else {
            res.send({ success: true });
        }
    });
});

app.get("/getItems", (req, res) => {
    db.query("SELECT * FROM items;", (err, result) => {
        if (err) console.log(err);
        res.send(result);
    })
});

app.get("/getItem", (req, res) => {
    const itemId = req.query.itemId;

    db.query("SELECT * FROM items WHERE id = ?;",
    [itemId],
    (err, result) => {
        if (err) {
            res.send({ success: false });
        }
        res.send({ success: true, item: result });
    });
})

app.post("/updateItem", (req, res) => {
    const id = req.body.id;
    const name = req.body.name;
    const par = req.body.par;
    const email = req.body.email;
    const stock = req.body.stock;
    const weeklyUsage = req.body.weeklyUsage;
    const price = req.body.price;

    db.query("UPDATE items SET name = ?, par = ?, email = ?, stock = ?, weeklyUsage = ?, price = ? WHERE id = ?;",
    [name, par, email, stock, weeklyUsage, price, id],
    (err, result) => {
        if (err) {
            console.log(err);
            res.send({ success: false });
        } else {
            db.query("SELECT * FROM items;", (error, result) => {
                res.send({ success: true, items: result })
            });
            
        }
    }); 
});

app.post("/deleteItem", (req, res) => {
    const id = req.body.itemId;

    db.query("DELETE FROM items WHERE id = ?;",
    id,
    (err, result) => {
        if (err) {
            console.log(err);
            res.send({ success: false });
        } else {
            db.query("SELECT * FROM items;", (error, result) => {
                res.send({ success: true, items: result })
            });
        }
        
    })
})

app.listen(3001, () => {
    console.log('Server running on port 3001');
});