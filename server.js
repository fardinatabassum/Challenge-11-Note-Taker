const express = require('express'); // Import express js
const path = require('path'); // Import built-in Node.js package 'path' to resolve path of files that are located on the server
const fs = require('fs')
const db = require("./db/db.json") 

const PORT = process.env.PORT || 3001; // Specify on which port the Express.js server will run
const app = express() // Initialize an instance of Express.js

// Sets up the Express app to handle data parsing
app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(express.static('public')) // Static middleware pointing to the public folder

// HTML ROUTE
// Create Express.js routes for default '/', '/index' and '/notes' endpoints

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
})

// GET request for notes
app.get('/notes', (req,res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
})


// API ROUTES
//Sends a JSON response with the correct content type.
// GET request
app.get('/api/notes', (req, res) => {
    res.json(db)
})

// POST request
app.post('/api/notes', (req, res) => {
    res.json(createNote(req.body, db))
})

// creates new note and adds it to the empty array
const createNote = (body, noteArr) => {
    body.id = noteArr.length;
    noteArr.push(body)
    fs.writeFileSync(
        path.join(__dirname, "./db/db.json"),
        JSON.stringify(noteArr)
    );
    return body;
}

// DELETE request
app.delete('/api/notes/:id', (req, res) => {
    deleteNote(req.params.id, db)
    res.json(true)
})

// deletes the node by matching the id of the note
const deleteNote = (id, noteArr) => {
    for(let i = 0; i < noteArr.length; i++) {
        if(noteArr[i].id == id) {
            noteArr.splice(i, 1)
            fs.writeFileSync(
                path.join(__dirname, "./db/db.json"),
                JSON.stringify(noteArr)
            );
        }
    }
}

// listen() method is responsible for listening for incoming connections on the specified port 
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);