const express = require('express');
const path = require('path');
const fs = require('fs')
const db = require("./db/db.json")

const PORT = process.env.PORT || 3001;
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(express.static('public'))

// HTML ROUTE
app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
})

app.get('/notes', (req,res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
})


// API ROUTES
app.get('/api/notes', (req, res) => {
    res.json(db)
})

app.post('/api/notes', (req, res) => {
    res.json(createNote(req.body, db))
})

const createNote = (body, noteArr) => {
    body.id = noteArr.length;
    noteArr.push(body)
    fs.writeFileSync(
        path.join(__dirname, "./db/db.json"),
        JSON.stringify(noteArr)
    );
    return body;
}


app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);