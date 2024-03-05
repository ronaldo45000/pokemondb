const express = require('express');
const mysql = require('mysql');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;
app.use("/assets",express.static("assets"));

// app.use(express.static(__dirname));

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root1234',
    database: 'project',
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

//this is insert for caughtpokemon table
app.post('/insert', (req, res) => {
    const { pokemon1, pokemon2,pokemon3,pokemon4,pokemon5,pokemon6,pokemon7,pokemon8 } = req.body
    const sql = 'INSERT INTO caughtpokemon (PokedexId, TrainerId,Pokemon_Species,Pokemon_Level,Ability,Nature,Nickname,Held_Item) VALUES (?, ?,?, ?,?, ?,?, ?)';
    db.query(sql, [pokemon1, pokemon2, pokemon3, pokemon4, pokemon5, pokemon6, pokemon7,pokemon8], (err) => {
        if (err) {
            // Check for constraint violation error
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: 'Duplicate entry. The move may already exist.' });
            } else if (err.code === 'SOME_OTHER_ERROR_CODE') {
                // Handle other constraint violation errors here
                return res.status(400).json({ error: 'Some other constraint violation error.' });
            } else {
                // Handle other types of errors
                return res.status(500).json({ error: 'Internal Server Error.' });
            }
        }

        // Successful insertion
        return res.status(200).json({ success: true, message: 'Move inserted successfully.' });
    });
});

//this is insert for moves table


app.post('/insert3', (req, res) => {
    const { moves1, moves2, moves3, moves4, moves5, moves6, moves7 } = req.body;

    const sql = 'INSERT INTO moves (Move_Name, Move_Type, Category, Power, Accuracy, PP, Move_Description) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [moves1, moves2, moves3, moves4, moves5, moves6, moves7], (err) => {
        if (err) {
            // Check for constraint violation error
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: 'Duplicate entry. The move may already exist.' });
            } else if (err.code === 'SOME_OTHER_ERROR_CODE') {
                // Handle other constraint violation errors here
                return res.status(400).json({ error: 'Some other constraint violation error.' });
            } else {
                // Handle other types of errors
                return res.status(500).json({ error: 'Internal Server Error.' });
            }
        }

        // Successful insertion
        return res.status(200).json({ success: true, message: 'Move inserted successfully.' });
    });
});

//this is the update for moves

app.post('/updateData2', (req, res) => {
    //be careful this get data base on order how you put, when query make sure it is in correct order (Update might mess order)
    const { moves1, moves2, moves3, moves4, moves5, moves6, moves7 } = req.body;
 
    const sql2 = 'UPDATE moves SET Power = ?, Accuracy = ?, PP = ?, Move_Description = ? WHERE Move_Name = ? AND Move_Type = ? AND Category = ?';

    db.query(sql2, [moves4, moves5, moves6, moves7, moves1, moves2, moves3], (err, result) => {
        if (err) {
            console.error('Error updating data:', err);
            res.json({ success: false, message: 'Error updating data in the database.' });
        } else {
            console.log('Number of records updated:', result.affectedRows);
            res.json({ success: true, message: 'Data updated successfully.' });
        }
    });
});
//this is the update for caughtpokemon
app.post('/updateData3', (req, res) => {
    //be careful this get data base on order how you put, when query make sure it is in correct order (Update might mess order)
    const { pokemon1, pokemon2, pokemon3, pokemon4, pokemon5, pokemon6, pokemon7,pokemon8 } = req.body;
 
    const sql2 = 'UPDATE caughtpokemon SET Pokemon_Species = ?, Pokemon_Level = ?, Ability = ?, Nature = ?,Nickname = ?, Held_Item = ? WHERE PokedexId = ? AND TrainerId = ?';

    db.query(sql2, [pokemon3, pokemon4, pokemon5, pokemon6, pokemon7, pokemon8, pokemon1,pokemon2], (err, result) => {
        if (err) {
            console.error('Error updating data:', err);
            res.json({ success: false, message: 'Error updating data in the database.' });
        } else {
            console.log('Number of records updated:', result.affectedRows);
            res.json({ success: true, message: 'Data updated successfully.' });
        }
    });
});
//if user and password match, it will let user to next page
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


// // 	{
//         if(query == 'user'){
//             sql = `SELECT * FROM reg ORDER BY user_id`;

//         }


//     else if(query == 'info'){
//         sql = `SELECT * FROM info ORDER BY fname`;
//     }
//     else 

//THIS IS VIEW FOR caughtpokemon,moves,typechart and pokemon
    
    if(query == 'caughtpokemon'){
        sql = `SELECT * FROM caughtpokemon ORDER BY PokedexId`;

    }
    else if(query == 'moves'){
        sql = `SELECT * FROM moves ORDER BY Move_Name`;

    }
    else if(query == 'typechart'){
        sql = `SELECT * FROM typechart ORDER BY Attacking_Type`;

    }
    else if (query == 'pokemon'){
        sql = `SELECT * FROM pokemon ORDER BY PokedexId`;
    }
    //make sure to hand empt
	else{
// sql = `SELECT * FROM reg ORDER BY user_id`;
sql = `SELECT * FROM typechart ORDER BY Attacking_Type`;

    }

db.query(sql, (error, results) => {

if (error) throw error;

response.send(results);

});

});
app.post("/delete_data", (request, response) => {

	const id = request.body.id;
    const fname = request.body.fname;
    const caughtPokemon = request.body.caughtPokedex;
    const move = request.body.Move_Name;


	const sql = `DELETE FROM reg WHERE user_id = '${id}'`;
	const sql2 = `DELETE FROM info WHERE fname = '${fname}'`;
    const sql3 = `DELETE FROM caughtpokemon WHERE PokedexId = '${caughtPokemon}'`;
    const sql4 = `DELETE FROM moves WHERE Move_Name = '${move}'`;

 

if (caughtPokemon) {
        db.query(sql3, (error, results) => {
            if (error) {
                console.error("Failed to delete data:", error);
                return response.status(500).json({ error: "Failed to delete data." });
            }

            response.json({
                message: "Data Deleted"
            });
        });
    }
    else if (move) {
        db.query(sql4, (error, results) => {
            if (error) {
                console.error("Failed to delete data:", error);
                return response.status(500).json({ error: "Failed to delete data." });
            }

            response.json({
                message: "Data Deleted"
            });
        });
    }
});




// Server start
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
