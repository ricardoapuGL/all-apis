import db from '../database'
import { Todo } from '../todo'


export const getTodos = async (): Promise<Todo[]> => {
    const { rows } = await db.query(`
    SELECT 
        todo_id as "todoId", 
        user_id as "userId", 
        text as "text", 
        done as "done" 
    FROM todo
    ORDER BY todo_id`, [])
    return rows as Todo[]
}

export const getTodo = async (todoId: string): Promise<Todo> => {
    const { rows } = await db.query(`
    SELECT 
        todo_id as "todoId", 
        user_id as "userId", 
        text as "text", 
        done as "done" 
    FROM todo 
    WHERE todo_id = $1`, [todoId])
    return rows[0] as Todo
}

export const createTodo = async (todo: Todo): Promise<Todo> => {
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
    return rows[0] as Todo
}

export const deleteTodo = async (todoId?: string): Promise<void> => {
    await db.query(`DELETE FROM  todo WHERE todo_id = $1`, [todoId])
}

export const patchTodo = async (todo: Partial<Todo>): Promise<Todo> => {
    const existingTodo = await getTodo(todo.todoId as string)
    const updatedTodo = { ...existingTodo, ...todo }
    const { rows } = await db.query(`
    UPDATE 
        todo
    SET 
    text = $1, 
    done = $2
    WHERE todo_id = $3
    
    RETURNING 
        todo_id as "todoId", 
        text as "text", 
        done as "done"
    `.replace(/\n/,' '), [updatedTodo.text, updatedTodo.done, updatedTodo.todoId])
    console.log(rows)
    return rows[0] as Todo
}