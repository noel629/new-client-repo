import Navbar from "../components/Navbar"
import styles from "../styles/Register.module.css"
import { useState } from "react"
import { ApolloProvider, gql, useMutation } from "@apollo/client"
import Toast from 'react-bootstrap/Toast'
import Swal from 'sweetalert2'


function Start() {
    const [ user, setUser ] = useState({})

    const REGISTER = gql`
        mutation register ($username: String!, $email: String!, $password: String!, $confirmPassword: String!){
            register(user: {
                username: $username,
                email: $email,
                password: $password,
                confirmPassword: $confirmPassword
            } ) {
                username
                email
            }
        }
    `
    const [register, {data, loading, error}] = useMutation(REGISTER)
    
    

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        try{
            await register({
                variables: user
            })
            Swal.fire(
                'Good job!',
                'Registered!',
                'success'
              )
        } catch(err) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: err.message,
            })
        }
    }

    const onChangeHandler = (e) => {
        setUser({...user, [e.target.name]: e.target.value})
    }
    return(
        <>
        <div className={styles.a}>
            <Navbar />
            <h1 class="d-flex justify-content-center">Get Started!</h1>
            <form class="col-md-4" onSubmit={onSubmitHandler}>
                <div class="form-row">
                    <div class="col">
                        <input type="text" name="username" class="form-control" placeholder="Username" onChange={onChangeHandler}/>
                    </div>
                    <div class="col">
                        <input type="email" name="email" class="form-control" placeholder="Email Address" onChange={onChangeHandler}/>
                    </div>
                    <div class="col">
                        <input type="password" name="password" class="form-control" placeholder="Password" onChange={onChangeHandler}/>
                    </div>
                    <div class="col">
                        <input type="password" name="confirmPassword" class="form-control" placeholder="Confirm Password" onChange={onChangeHandler}/>
                    </div>
                </div>
                <button type="submit" class="btn btn-outline-secondary">Register!</button>
            </form>
            <h6>Already have an account? <a href="login">Login Here!</a></h6>
        </div>
        </>
    )
}

export default Start;