import Navbar from "../components/Navbar"
import AddTodo from "../components/Forms/AddTodos"
import { useState, useEffect } from "react"
import { gql, useQuery} from "@apollo/client"
import styles from "../styles/Todo.module.css"
import Todo from "../components/Todo"
import {Container, Row, Col, Card, Modal, Button} from "react-bootstrap"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"


function todo() {

    const onDragEnd = (result) => {
        const { source, destination, draggableId } = result
        if(!destination){
            return;
        }
        
        if(source.droppableId === destination.droppableId && source.index === destination.index) {
            return;
        }
        
        const id = draggableId
        const start = source.draggableId
        const end = destination.droppableId

        if (start !== end) {
            if(end === '0') {
                update({
                    variables: {
                        id: id,
                        category: 'To do'
                    },
                });
            } else if (end === '1') {
                update({
                    variables: {
                        id: id,
                        category: 'complete',
                    },
                });
            }
        }
    };

    const GET_TODOS = gql`
        query{
            getTodos {
                id
                date
                title
                description
                isComplete
            }
        }
    `

    


    const { loading, error, data } = useQuery(GET_TODOS)

    const [todos, setTodos] = useState([])
    useEffect(() => {
        if(!loading) setTodos(data.getTodos)
    }, [todos, data])

    let showTodos = loading ? <h1> Loading... </h1>:
    todos.map(todo => <Todo key={todo.id} todo={todo} GET_TODOS={GET_TODOS} />)
    console.log(todos)

    return(
        <>
            <Navbar />
            
            <DragDropContext onDragEnd={onDragEnd}>
                <h1 align="center">Todos</h1>
                <Container fluid class="contain">
                    <Row className={styles.R} align="center">
                        <Col md={4} class="col">
                            <Droppable droppableId="0">
                                { (provided, snapshot) => (
                                    <div className="todos"
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}>
                                        <h1>In Progress</h1>
                                        {
                                            todos?.target?.map((todo, index) => (
                                                !todo.isComplete ?
                                                <Draggable key={todo.id}
                                                draggableId={todo.id}
                                                index={index}>
                                                    {(provided, snapshot) => (
                                                        <Card ref={provided.innerRef}
                                                        key={todo.id}
                                                        index={index}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}>
                                                            <Card.body>
                                                                <div className="d-flex justify-content-between">
                                                                    <h6 className="text-d">{todo.title}</h6>

                                                                    <div>
                                                                        <i className="bi-trash cursor mx-2">
                                                                            onClick={() => completeHandler(todo.id)}</i>
                                                                    </div>
                                                                </div>
                                                            </Card.body>
                                                        </Card>
                                                    )}
                                                </Draggable>
                                                :null
                                            ))
                                        }
                                        {provided.placeholder}
                                    </div>
                                )}
                                
                                    {showTodos}
                            </Droppable>
                        </Col> 
                        

                        {/* <Col md={4} class="col">
                            <Droppable droppableId="1">
                                { (provided) => (
                                    <div className="todos remove"
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}>
                                            <h1>Completed</h1>
                                            {
                                                todos?.target?.map((todo, index) => (
                                                    todo.isFinish ?
                                                    <Draggable key ={todo.id}
                                                    draggableId={todo.id}
                                                    index={index}>
                                                        { (provided) => (
                                                            <card ref={provided.innerRef}
                                                            key={todo.id}
                                                            index={index}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}>
                                                                <Card.body>
                                                                    <div className="d-flex justify-content-between">
                                                                        <h6>{todo.name}</h6>
                                                                    </div>
                                                                </Card.body>
                                                            </card>
                                                        )}
                                                    </Draggable>
                                                    : null
                                                ))
                                            }
                                            {provided.placeholder}
                                    </div>
                                )}
                                
                            </Droppable>
                        </Col> */}
                        <Col md={4} class="col">
                            <h1>Enter Some Stuff</h1>
                            <AddTodo GET_TODOS={GET_TODOS}/>
                        </Col>
                    </Row>
                </Container>
            </DragDropContext>
        </>
    )
}

export default todo;