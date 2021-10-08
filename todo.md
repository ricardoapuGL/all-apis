- [ ] simple hello world api in
    - [x] NodeJS + express + pg-node
    - [x] Go + Gin
    - [ ] Python + Django
    - [x] Rust + Actix

- [ ] simple DB access in all langs
    - [x] NodeJS + node-pg
    - [ ] Go + go-pg
    - [ ] Python + Django
    - [x] Rust + sqlx
- [x] simple TODO app-frontend

#RUST

$ time curl localhost:8080/todo
[{"todo_id":9,"user_id":null,"text":"change style when done","done":false},{"todo_id":10,"user_id":null,"text":"Damn","done":false}]

real    0m0.744s
user    0m0.015s
sys     0m0.000s
  
$ time curl localhost:8080/todo
[
    {
        "todoId": 9,
        "userId": null,
        "text": "change style when done",
        "done": false
    },
    {
        "todoId": 10,
        "userId": null,
        "text": "Damn",
        "done": false
    }
]
real    0m0.223s
user    0m0.000s
sys     0m0.031s