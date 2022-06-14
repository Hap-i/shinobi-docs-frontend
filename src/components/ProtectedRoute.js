import axios from 'axios'
import React from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/authContext'

export const ProtectedRoute = ({ children }) => {
    const { user, setuser } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()
    async function fetchData(children) {
        await axios({
            url: "http://127.0.0.1:3001/api/v1/user/me",
            method: "GET",
            withCredentials: true
        }).then(res => {
            setuser(res.data.data)
            return children
        }).catch(err => {
            console.log("user is not there in protected route")
            navigate("/signin", { replace: true, state: { path: location.pathname } })
        })
    }
    if (!user) {
        fetchData(children)
        // return <Navigate to="/signin" replace state={{ path: location.pathname }} />
    } else {
        console.log("ffff")
        return children
    }
}