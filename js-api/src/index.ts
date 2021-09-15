import fs from 'fs'
import express from 'express'
import { Todo }  from './todo'
let todos: Todo[]
const readTodos = () => {
    todos = JSON.parse(fs.readFileSync("../common/todos.json",'utf8'))
}
readTodos()
const app = express()
const port = 8080 // default port to listen

// define a route handler for the default home page
app.get('/todos', (req, res) => {
    res.header("Content-Type",'application/json');
    res.send(JSON.stringify(todos, null, 4));
})

// start the Express server
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`)
})
