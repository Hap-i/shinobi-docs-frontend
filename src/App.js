import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AllDocument from "./pages/AllDocument";
import TextEditor from "./pages/TextEditor";
import SignUp from "./pages/Signup";
import SignIn from "./pages/SignIn";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          exact
          path="/"
          element={<AllDocument />}
        ></Route>
        <Route path="/document/:id" element={<TextEditor />}></Route>
        <Route path="/signup" element={<SignUp />}></Route>
        <Route path="/signin" element={<SignIn />}></Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
