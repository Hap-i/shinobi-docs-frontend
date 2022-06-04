import React, { useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

import TextEditorHeader from "../components/TextEditorHeader";

var toolbarOptions = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  ["bold", "italic", "underline", "strike"],
  [{ color: [] }, { background: [] }],
  ["blockquote", "code-block"],

  [{ list: "ordered" }, { list: "bullet" }],
  [{ indent: "-1" }, { indent: "+1" }],
  [{ align: [] }],
  [{ header: 1 }, { header: 2 }],
  [{ script: "sub" }, { script: "super" }],
  [{ direction: "rtl" }],

  ["link", "image", "video"],

  ["clean"],
];

export default function TextEditor() {
  const [quill, setquill] = useState();
  const wrapperRef = useRef();

  useEffect(() => {
    const editor = document.createElement("div");
    wrapperRef.current.append(editor);
    const q = new Quill(editor, {
      modules: {
        toolbar: toolbarOptions,
      },
      theme: "snow",
    });
    // q.disable();
    // q.setText("Loading...");
    setquill(q);
    return () => {
      wrapperRef.current.innerHTML = "";
    };
  }, []);
  return (
    <>
      <TextEditorHeader />
      <div className="text-editor-container" ref={wrapperRef}></div>
    </>
  );
}
