import axios from 'axios'
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/authContext'

export const ProtectedRoute = ({ children }) => {
    const { user, setuser } = useAuth()
    if (!user) {
        axios({
            url: "http://127.0.0.1:3001/api/v1/user/me",
            method: "GET",
            withCredentials: true

        }).then((res) => {
            setuser(res.data.data)
        }).catch((err) => {
            return <Navigate to="/signin" />
        })

    }
    return children
}