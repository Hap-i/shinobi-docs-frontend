import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AllDocument from "./pages/AllDocument";
import TextEditor from "./pages/TextEditor";
import SignUp from "./pages/Signup";
import SignIn from "./pages/SignIn";
import { ProtectedRoute } from "./components/ProtectedRoute";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          exact
          path="/"
          element={<ProtectedRoute><AllDocument /></ProtectedRoute>}
        ></Route>
        <Route path="/document/:id"
          element={<ProtectedRoute><TextEditor /></ProtectedRoute>}></Route>
        <Route path="/signup" element={<SignUp />}></Route>
        <Route path="/signin" element={<SignIn />}></Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
