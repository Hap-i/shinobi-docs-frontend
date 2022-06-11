import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import TextEditor from "./pages/TextEditor";
import SignUp from "./pages/Signup";
import SignIn from "./pages/SignIn";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useEffect } from "react";
import axios from "axios";
import { useAuth } from "./context/authContext";

function App() {
  const { user, setuser } = useAuth()

  useEffect(() => {
    if (!user) {

      axios({
        url: "http://127.0.0.1:3001/api/v1/user/me",
        method: "GET",
        withCredentials: true
      }).then(res => {
        setuser(res.data.data)
      }).catch(err => {
        console.log(err)
      })
    }
  }, []);
  return (
    <Routes>
      <Route
        path="/"
        element={<ProtectedRoute><Homepage /></ProtectedRoute>}
      ></Route>
      <Route path="document/:id"
        element={<ProtectedRoute><TextEditor /></ProtectedRoute>}></Route>
      <Route path="signup" element={<SignUp />}></Route>
      <Route path="signin" element={<SignIn />}></Route>

    </Routes>
  );
}

export default App;
