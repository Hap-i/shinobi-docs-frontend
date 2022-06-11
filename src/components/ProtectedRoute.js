import axios from 'axios'
import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/authContext'

export const ProtectedRoute = ({ children }) => {
    const { user, setuser } = useAuth()
    const location = useLocation()
    if (!user) {
        return <Navigate to="/signin" replace state={{ path: location.pathname }} />
    }
    return children
}