import express, { Request, Response } from 'express'
import dotenv from 'dotenv'
import path from 'path'
import { Todo } from './todo'
import { createTodo, deleteTodo, getTodos, patchTodo } from './todo/controller'
import db from './database'

//configure dotenv
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const app = express()
const port = process.env.PORT // default port to listen
app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())

app.get('/todo', async (req, res, next) => {
    try {
        const todos = await getTodos()
        console.log(todos)
        res.header("Content-Type", 'application/json');
        res.send(JSON.stringify(todos, null, 4));
    } catch (error) {
        next(error)
    }

})

app.post('/todo', async (req, res, next) => {
    try {
        const todo: Todo = req.body
        console.log(todo)
        //TODO add validation
        if (!todo) {
            throw Error('No todo passed to create new todo')
        }
        const newTodo = await createTodo(todo)
        res.header("Content-Type", 'application/json');
        res.send(JSON.stringify(newTodo, null, 4));
    } catch (error) {
        next(error)
    }
})

app.patch('/todo/:id', async (req, res, next) => {
    try {
        const todo: Partial<Todo> = req.body
        const id = req.params.id
        //TODO add validation
        console.log({ ...todo, todoId: id })
        if (!todo || !id) {
            throw Error('No todo passed to update new todo')
        }
        console.log(req.body)
        const newTodo = await patchTodo({ ...todo, todoId: id })
        res.send(JSON.stringify(newTodo, null, 4));
    } catch (error) {
        next(error)
    }
})

app.delete('/todo/:id', async (req, res, next) => {
    try {
        const id = req.params.id
        //TODO add validation
        if (!id) {
            throw Error('No id passed to delete todo')
        }
        await deleteTodo(id)
        res.status(200).send({ id })
    } catch (error) {
        next(error)
    }
})

app.use(function (err: Error, req: Request, res: Response) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

// start the Express server
const server = app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`)
})


process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server')
    server.close(() => {
        console.log('HTTP server closed')
    })
    db.end().then(() => console.log('SQL connection closed'))
})