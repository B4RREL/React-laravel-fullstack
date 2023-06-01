import { Link } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import { useRef, useState } from "react";
import axiosClient from "../axios-client";

const Login = () => {

   const emailRef = useRef();
   const passwordRef = useRef();


   const {setToken,setUser} = useStateContext()
   const [errors, setErrors] = useState(null)
    const onSubmit = (event) => {
        event.preventDefault();
        const payload = {

            email: emailRef.current.value,
            password: passwordRef.current.value,

        }
        console.log(payload);
        axiosClient.post('/login', payload)
        .then(({data}) => {
            setToken(data.token)
            setUser(data.user)
        })
        .catch(err =>{
            const response = err.response;
            if(response && response.status === 422) {
                if(response.data.errors) {
                setErrors(response.data.errors);
                } else {
                    setErrors({
                        email: [response.data.message]
                    });
                }
        }})
    }

    let errEmail;
    let errPass;
  return (
    <div className="login-signup-form animated fadeInDown">
        <div className="form">
            <form onSubmit={(event) => onSubmit(event)}>
                <h1 className="title">Login to your account</h1>
                {
                   errors && <div className="alert-danger">

                     {

                      Object.keys(errors).map((key) => {
                        if(key == 'email') {
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
                {errEmail && <p style={{color: 'red'}}>{errEmail}</p>}
                <input ref={emailRef} type="email" placeholder="Email" />
                {errPass && <p style={{color: 'red'}}>{errPass}</p>}
                <input ref={passwordRef} type="password" placeholder="Password" />
                <button className="btn btn-block">Login</button>
                <p className="message">
                  Not registered? <Link to="/signup">Create an account</Link>
                </p>
            </form>
        </div>
    </div>
  )
}

export default Login
