import axios from 'axios'
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/authContext'

export const ProtectedRoute = ({ children }) => {
    const { user, setuser } = useAuth()
    if (!user) {
        return <Navigate to="/signin" />
    }
    return children
}