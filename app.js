const express = require('express');
const mysql = require('mysql');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();
const port = 4000;
app.use("/assets",express.static("assets"));

// app.use(express.static(__dirname));

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root1234',
    database: 'bennett_riley_le_thinh_db',
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

app.get('/search', (request, response) => {
    //q here from index.html
const query = request.query.q;
var sql = '';


if(query != 'info'&&query!= 'caughtpokemon' &&query!= 'moves' &&query!="typechart")
	{
        if(query == 'user'){
            sql = `SELECT * FROM reg ORDER BY user_id`;

        }
else{
		sql = `SELECT * FROM reg WHERE username LIKE '%${query}%'  OR user_id LIKE '%${query}%'`;
}
    }

    else if(query == 'info'){
        sql = `SELECT * FROM info ORDER BY fname`;

    }
    else if(query == 'caughtpokemon'){
        sql = `SELECT * FROM caughtpokemon ORDER BY PokedexId`;

    }
    else if(query == 'moves'){
        sql = `SELECT * FROM moves ORDER BY Move_Name`;

    }
    else if(query == 'typechart'){
        sql = `SELECT * FROM typechart ORDER BY Attacking_Type`;

    }
    //make sure to hand empt
	else{
// sql = `SELECT * FROM reg ORDER BY user_id`;
sql = `SELECT * FROM reg ORDER BY user_id`;
    }

db.query(sql, (error, results) => {

if (error) throw error;

response.send(results);

});

});
app.post("/delete_data", (request, response) => {

	const id = request.body.id;
    const fname = request.body.fname;

    const query = request.body.q;
console.log("query is " + fname)
	const sql = `DELETE FROM reg WHERE user_id = '${id}'`;
	const sql2 = `DELETE FROM info WHERE fname = '${fname}'`;
    if(id){
	db.query(sql, (error, results) => {
		response.json({
			message : 'Data Deleted'
		});
	});
}
else if(fname){
    db.query(sql2, (error, results) => {
		response.json({
			message : 'Data Deleted'
		});
	});
}
});
// app.post("/delete_data", (request, response) => {

// 	const id = request.body.id;

// 	const sql2 = `DELETE FROM info WHERE fname = '${id}'`;


//     db.query(sql2, (error, results) => {
// 		response.json({
// 			message : 'Data Deleted'
// 		});
// 	});
// });

// Server start
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
