import { Link } from "react-router-dom"
import axiosClient from "../axios-client";
import { useRef, useState } from "react";
import { useStateContext } from "../context/ContextProvider";

const Signup = () => {
   const nameRef = useRef();
   const emailRef = useRef();
   const passwordRef = useRef();
   const confirmPasswordRef = useRef();

   const {setToken,setUser} = useStateContext()
   const [errors, setErrors] = useState(null)

    const onSubmit = (event) => {
        event.preventDefault();
        const payload = {
            name: nameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
            password_confirmation: confirmPasswordRef.current.value
        }
        console.log(payload);
        axiosClient.post('/signup', payload)
        .then(({data}) => {
            setToken(data.token)
            setUser(data.user)
        })
        .catch(err =>{
            const response = err.response;
            if(response && response.status === 422) {
                setErrors(response.data.errors);

        }})
    }
    let errName;
    let errEmail;
    let errPass;


    return (
        <div className="login-signup-form animated fadeInDown">
        <div className="form">
            <form onSubmit={(event) => onSubmit(event)}>
                <h1 className="title">Sign Up for free</h1>
                {
                   errors && <div className="alert-danger">

                     {

                      Object.keys(errors).map((key) => {
                        if(key == 'name'){
                             errName = errors[key][0]
                        } else if(key == 'email'){
                             errEmail = errors[key][0]
                        } else if(key == 'password'){
                             errPass = errors[key][0]
                        } else {
                            return (
                                <p key={key} >{errors[key][0]}</p>
                            )
                        }

                    })

                     }
                   </div>
                }
                 {errName && <p style={{color: 'red'}}>{errName}</p>}
                <input ref={nameRef} type="text" placeholder="Full name" />
                {errEmail && <p style={{color: 'red'}}>{errEmail}</p>}
                <input ref={emailRef} type="email" placeholder="Email Address" />
                {errPass && <p style={{color: 'red'}}>{errPass}</p>}
                <input ref={passwordRef} type="password" placeholder="Password" />

                <input ref={confirmPasswordRef} type="password" placeholder="Confirm Password" />
                <button className="btn btn-block">Signup</button>
                <p className="message">
                  Already registered? <Link to="/login">Sign In</Link>
                </p>
            </form>
        </div>
    </div>
    )
  }

  export default Signup
