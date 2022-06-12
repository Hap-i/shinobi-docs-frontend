import React, { useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { io } from 'socket.io-client'

import TextEditorHeader from "../components/TextEditorHeader";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const SAVE_INTERVAL = 2000;
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
  const [socket, setsocket] = useState();
  const [quill, setquill] = useState();
  const wrapperRef = useRef();
  const { id: documentId } = useParams()
  const navigate = useNavigate()

  // connected with socket.io
  useEffect(() => {
    axios({
      url: `http://127.0.0.1:3001/api/v1/user/checkaccess/${documentId}`,
      method: "GET",
      withCredentials: true
    }).then((res) => {
      const s = io("http://127.0.0.1:3001")
      setsocket(s)
      console.log("connected to server");
    }).catch((err) => {
      navigate("/")
    })
    return () => {
      console.log("disconnect")
      socket.disconnect()
    }
  }, []);

  // use to load doc
  useEffect(() => {
    if (socket === undefined || quill === undefined) return
    // server sends the doc to load it
    socket.once("load-document", documents => {
      console.log(documents);
      quill.setContents(documents);
      quill.enable();
    })
    //to inform server that we are using this doc
    socket.emit("get-documnet", documentId)

  }, [socket, quill, documentId]);

  // used to save document
  useEffect(() => {
    if (socket === undefined || quill === undefined) return
    const interval = setInterval(() => {
      socket.emit("doc-save", quill.getContents())
    }, SAVE_INTERVAL)
    return () => {
      clearInterval(interval)
    }
  }, [socket, quill]);

  // use to receive changes and update content
  useEffect(() => {
    if (socket === undefined || quill === undefined) return
    const handler = (delta) => {
      quill.updateContents(delta)
    }
    socket.on("receive-changes", handler)
    return () => {
      socket.off("receive-changes", handler)
    }
  }, [socket, quill]);

  // use to send changes to server
  useEffect(() => {
    if (socket === undefined || quill === undefined) return

    const handler = (delta, oldDelta, source) => {
      if (source !== 'user') return
      socket.emit("send-changes", delta)
    }
    quill.on("text-change", handler)
    return () => {
      quill.off("text-change", handler)
    }
  }, [socket, quill]);

  //use to initialize text editor Quill
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
