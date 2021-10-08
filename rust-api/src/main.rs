use actix_web::{web, get, App, HttpResponse, HttpServer, Responder};
use sqlx::postgres::PgPoolOptions;
use serde::{Serialize,Deserialize};
use dotenv::dotenv;
use std::env;


#[derive(Serialize,Deserialize)]
struct Todo {
    pub todo_id: i32,
    pub user_id: Option<String>,
    pub text: String,
    pub done: Option<bool>,
}

#[get("/")]
async fn hello() -> impl Responder {
    HttpResponse::Ok().body("Hello world!")
}

#[get("/todo")]
async fn todo(pool: web::Data<sqlx::Pool<sqlx::Postgres>>) -> impl Responder  {
    let result =
    sqlx::query_as!(Todo, r#"select * from todo"#)
        .fetch_all(pool.get_ref()).await;
    match result {
        Ok(todos) => HttpResponse::Ok().json(todos),
        Err(err) => {
            println!("error fetching todos: {}", err);
            HttpResponse::InternalServerError()
                .body("Error trying to read all todos from database")
        }
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    let db_url = env::var("DATABASE_URL").unwrap();
    let pool = PgPoolOptions::new()
        .max_connections(4)
        .connect(&db_url).await.unwrap();

    let server = HttpServer::new(move || {
        App::new()
            .data(pool.clone())
            .service(hello)
            .service(todo)
    });
    println!("Rust-API listening on localhost:8080");
    server.bind("127.0.0.1:8080")?
    .run()
    .await
}
