package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

var todos []Todo

type Todo struct {
	ID   string `json:"todoId"`
	Text string `json:"text"`
	Done bool   `json:"done"`
}

func readTodos(t *[]Todo) {
	jsonFile, err := os.Open("../common/todos.json")
	// if we os.Open returns an error then handle it
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println("Successfully Opened todos.json")
	// defer the closing of our jsonFile so that we can parse it later on
	defer jsonFile.Close()

	byteValue, _ := ioutil.ReadAll(jsonFile)

	json.Unmarshal([]byte(byteValue), &t)
}

func getTodos(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, todos)
}

func main() {
	readTodos(&todos)
	fmt.Println(todos)
	router := gin.Default()
	router.GET("/todos", getTodos)
	router.Run("localhost:8080")
}
