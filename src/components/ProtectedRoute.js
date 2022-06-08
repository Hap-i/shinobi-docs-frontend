import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/authContext'

export const ProtectedRoute = ({ children }) => {
    const { user } = useAuth()
    if (!user) {
        // if user is not there call /me route
        // and get status code if it is 401 send it to login 
        // or get user details and store.
        // try passing setuser
        return <Navigate to="/signin" />
    }
    return children
}
