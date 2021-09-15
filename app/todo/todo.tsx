export interface Todo {
    todoId: string
    userId: string
    text: string
    done: boolean
}

export const todos = [
    {
        todoId: "1",
        userId: "1",
        text: "Saludar a juanca",
        done: false
    },
    {
        todoId: "2",
        userId: "1",
        text: "Jeru",
        done: false
    },
    {
        todoId: "3",
        userId: "1",
        text: "Sarah Vaughan and Clifford Brown",
        done: false
    }
]