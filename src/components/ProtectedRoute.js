import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/authContext'

export const ProtectedRoute = ({ children }) => {
    const { user, setuser } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()
    async function fetchData(children) {
        await axios({
            url: `${process.env.REACT_APP_API_BASE_URL}/api/v1/user/me`,
            method: "GET",
            withCredentials: true
        }).then(res => {
            setuser(res.data.data)
            return children
        }).catch(err => {
            navigate("/signin", { replace: true, state: { path: location.pathname } })
        })
    }
    if (!user) {
        fetchData(children)
        // return <Navigate to="/signin" replace state={{ path: location.pathname }} />
    } else {
        return children
    }
}