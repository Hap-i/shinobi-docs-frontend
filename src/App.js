import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import TextEditor from "./pages/TextEditor";
import SignUp from "./pages/Signup";
import SignIn from "./pages/SignIn";
import { ProtectedRoute } from "./components/ProtectedRoute";
// const dotenv = require('dotenv')
// dotenv.config({ path: './.env.development.local' })

function App() {
  return (
    <Routes>
      <Route
        strict
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
