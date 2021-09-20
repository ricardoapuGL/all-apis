import express, { Request, Response } from 'express'
import db from './database'
import dotenv from 'dotenv'
import path from 'path'
import { Todo } from './todo'

//configure dotenv
dotenv.config({ path: path.resolve(__dirname, '../.env')})

const app = express()
const port = process.env.PORT // default port to listen
app.use(express.urlencoded({
    extended: true
  }))
app.use(express.json())

app.get('/todo', async (req, res, next) => {
    try {
        res.header("Content-Type",'application/json');
        const { rows } = await db.query(`
        SELECT 
            todo_id as "todoId", 
            user_id as "userId", 
            text as "text", 
            done as "done" 
        FROM todo`)
        res.send(JSON.stringify(rows, null, 4));
    } catch (error) {
        next(error)   
    }

})

app.post('/todo', async (req, res, next) => {
    try{
        const todo: Todo = req.body
        console.log(todo)
        //TODO add validation
        if(!todo){
            throw Error('No todo passed to create new todo')
        }
        const { rows } = await db.query(`
        INSERT INTO 
            todo(text, done) 
        VALUES 
            ($1, $2) 
        RETURNING 
            todo_id as "todoId", 
            text as "text", 
            done as "done"
        `, [todo.text, todo.done])
        res.header("Content-Type",'application/json');
        res.send(JSON.stringify(rows, null, 4));
    } catch (error) {
        next(error)   
    }
})

app.delete('/todo/:id', async (req, res, next) => {
    try{
        const id = req.params.id
        //TODO add validation
        if(!id){
            throw Error('No id passed to delete todo')
        }
        const result = await db.query(`DELETE FROM  todo WHERE todo_id = $1`, [id])
        console.log(result)
        res.send(JSON.stringify(result, null, 4));
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