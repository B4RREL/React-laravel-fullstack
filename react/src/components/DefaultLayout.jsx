import { Link, Navigate, Outlet } from "react-router-dom"
import { useStateContext } from "../context/ContextProvider"
import axiosClient from "../axios-client"
import { useEffect } from "react"

const  DefaultLayout = () => {
    const {user,token,setToken,setUser,notification} = useStateContext()

    useEffect(() => {
        axiosClient.get('/user')
    .then(({data}) => {
        setUser(data);

    })}, [])

    if(!token) {
        return <Navigate to="/login" />
    }

    const onLogout = (ev) => {
        ev.preventDefault()
        axiosClient.post('/logout')
        .then(() => {
            setUser({})
            setToken(null)
        })
    }
   return (
    <div id="defaultLayout">
        <aside >
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/users">Users</Link>
        </aside>
        <div className="content">
            <header>
                <div>
                    Header
                </div>
                <div>
                    {user.name}
                    <a href="#" onClick={(ev) => onLogout(ev)} className="btn-logout">Logout</a>
                </div>
            </header>
            <main>
                <Outlet/>
            </main>
        </div>
       {notification &&
            <div className="notification">{notification}</div>
       }
    </div>
   )

}

export default DefaultLayout
