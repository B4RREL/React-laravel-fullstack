import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import axiosClient from "../axios-client";
import { useStateContext } from "../context/ContextProvider";

export default function UserForm() {
    const {id} = useParams();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);
    const {setNotification} = useStateContext()
    const navigate = useNavigate();
    const [user, setUser] = useState({
        id : null,
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    if(id) {
        useEffect(() => {
            setLoading(true);
            axiosClient.get(`/users/${id}`)
            .then(({data}) => {
                setLoading(false);
                setUser(data.data);
            })
            .catch(() => {
                setLoading(false);
            })
        },[])
    }
    const onSubmit = (ev) => {
        ev.preventDefault();
        if(user.id){
            axiosClient.put(`/users/${user.id}`, user)
            .then(() => {
                setNotification("User updated successfully")
                navigate(`/users`)
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
        } else {
            axiosClient.post(`/users`, user)
            .then(() => {
                setNotification("User added successfully")
                navigate(`/users`)
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
    }
    let errName;
    let errEmail;
    let errPass;
    return (
        <>
            {user.id &&<h1>Update User: {user.name}</h1>}
            {!user.id &&<h1>New User</h1>}
            <div className="card animated fadeInDown">
                {loading &&
                    <div className="text-center">
                        Loading...
                    </div>
                }
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
                {!loading &&
                <form onSubmit={(ev) => onSubmit(ev)}>
                    {errName && <p style={{color: 'red'}}>{errName}</p>}
                    <input value={user.name} onChange={(ev) => setUser({...user, name: ev.target.value})} type="text" placeholder="Name" />
                    {errEmail && <p style={{color: 'red'}}>{errEmail}</p>}
                    <input value={user.email} onChange={(ev) => setUser({...user, email: ev.target.value})} type="email" placeholder="Email" />
                    {errPass && <p style={{color: 'red'}}>{errPass}</p>}
                    <input type="password" onChange={(ev) => setUser({...user, password: ev.target.value})} placeholder="Password" />
                    <input type="password" onChange={(ev) => setUser({...user, password_confirmation: ev.target.value})} placeholder="Password confirmation" />
                    <button className="btn">Save</button>
                </form>
                }
            </div>
        </>
    )
}
