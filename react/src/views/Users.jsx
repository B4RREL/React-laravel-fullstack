import { useEffect, useState } from "react"
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";
import UserForm from "./UserForm";
import { useStateContext } from "../context/ContextProvider";
import axios from "axios";

const Users = () => {
    const [users,setUsers] = useState([]);
    const [loading,setLoading] = useState(false);
    const {setNotification} = useStateContext()
    const [links,setLinks] = useState([]);

    useEffect(() => {
        getUsers();
    },[])

    const onDelete = (user) => {
        if(!window.confirm('Are you sure you want to delete this user?')){
            return
        }
        axiosClient.delete(`/users/${user.id}`)
        .then(() => {
            setNotification("User deleted successfully")
            getUsers();

        })
    }



    const getUsers = (page) => {
        setLoading(true);
        if(!page) {
        axiosClient.get('/users')
        .then(({data}) => {
            setLoading(false);
            console.log(data);
            setUsers(data.data)
            setLinks(data.meta.links);
        })
        .catch(() => {
            setLoading(false);
        });
    } else {

         axiosClient.get("/users",{
            params: {
                page: page
            }
         })
        .then(({data}) => {
            setLoading(false);
            console.log(data);
            setUsers(data.data)
            setLinks(data.meta.links);
        })
        .catch(() => {
            setLoading(false);
        });
    }
}



    return (
      <div>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h1>Users</h1>
            <Link to="/users/new" className="btn-add">Add new</Link>
        </div>
        <div className="card animated fadeInDown">
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>NAME</th>
                    <th>EMAIL</th>
                    <th>CREATE DATE</th>
                    <th>ACTIONS</th>
                </tr>
            </thead>
            {loading && <tbody>
                <tr>
                    <td colSpan="5" className="text-center">Loading...</td>
                </tr>
            </tbody>
            }

            {!loading &&<tbody>
               {
                users.map((user) => {
                    return (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.created_at}</td>
                            <td>
                                <Link to={`/users/${user.id}`} className="btn-edit">Edit</Link>
                                &nbsp;
                                <button onClick={() => onDelete(user)} className="btn-delete">Delete</button>
                            </td>
                        </tr>
                    )
                })
               }
            </tbody>
}
        </table>
        </div>
        <div className="pagination" >


  {
    links.map((link) => {
        return (
            <a className={link.active ? "active" : ""} onClick={() => getUsers(link.url.slice(38))} key={link.label}>
               {link.label.includes("&raquo")? ">" : link.label.includes("&laquo") ? "<" : link.label}
            </a>
        )
    })
  }


</div>

        </div>

    )
  }

  export default Users
