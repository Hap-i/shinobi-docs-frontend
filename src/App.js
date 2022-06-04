import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AllDocument from "./pages/AllDocument";
import TextEditor from "./pages/TextEditor";
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
