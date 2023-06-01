import { createContext,useState,useContext } from "react";


const stateContext = createContext({
    user: null,
    token: null,
    setUser: () => {},
    setToken: () => {},
    setNotification: () => {},
})



export const ContextProvdier = ({children}) => {
    const [user, setUser] = useState({})
    const [token, _setToken] = useState(localStorage.getItem("ACCESS_TOKEN"))
    const [notification, _setNotification] = useState()

    const setNotification = (message) => {
        _setNotification(message)
        setTimeout(() => {
            _setNotification('')
        }, 5000)
    }
    const setToken = (token) => {
        _setToken(token)
        if(token){
            localStorage.setItem("ACCESS_TOKEN", token)
        } else {
            localStorage.removeItem("ACCESS_TOKEN")
        }
    }
    return (
            <stateContext.Provider value={{
                user,
                token,
                setUser,
                setToken,
                notification,
                setNotification
            }}>
                {children}
            </stateContext.Provider>
        )
}

export const useStateContext = () => {
    return useContext(stateContext)
}
