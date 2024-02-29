const express = require('express');
const mysql = require('mysql');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();
const port = 5500;
app.use("/assets",express.static("assets"));

// app.use(express.static(__dirname));

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root1234',
    database: 'register',
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});

// Middleware //NEED THIS ONE 
app.use(session({
    secret: 'secret_key',
    resave: true,
    saveUninitialized: true
}));

//for actually reading the string
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



// send to homepage 
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/loginTest.html');
});
app.use(express.static(__dirname));
//Post your register data into database

//communicate to server
app.post('/register', (req, res) => {
    const { username, password } = req.body
    const sql = 'INSERT INTO reg (username, password) VALUES (?, ?)';
    db.query(sql, [username, password], (err) => {
        if (err) throw err;
        res.sendFile(__dirname + '/loginTest.html')
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM reg WHERE username = ? AND password = ?';
    db.query(sql, [username, password], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            req.session.loggedin = true;
            req.session.username = username;
                        //just give a string name (like a address to get in)
         //   res.redirect('/navB.html');
            res.sendFile(__dirname + '/navB.html');
        } else {
         res.sendFile(__dirname + '/loginTest.html');
          }
    });
});

// Server start
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
