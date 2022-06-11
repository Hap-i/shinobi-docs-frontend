import React, { useContext, useState } from 'react'
// create context
const AuthContext = React.createContext()

// make custom hook to call
export function useAuth() {
    return useContext(AuthContext)
}

// logic and wrap children
export function AuthProvider({ children }) {
    const [user, setuser] = useState(false);
    return (
        <AuthContext.Provider value={{ user, setuser }}>
            {children}
        </AuthContext.Provider>
    )
}
