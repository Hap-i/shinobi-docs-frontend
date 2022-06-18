import React, { useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { io } from 'socket.io-client'

import TextEditorHeader from "../components/TextEditorHeader";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

// const SAVE_INTERVAL = 2000;
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
  const [docDetails, setdocDetails] = useState();
  const wrapperRef = useRef();
  const { id: documentId } = useParams()
  const navigate = useNavigate()
  const [viewOnly, setviewOnly] = useState(true);
  const [shouldSave, setshouldSave] = useState({});


  function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  // connected with socket.io
  useEffect(() => {
    axios({
      url: `${process.env.REACT_APP_API_BASE_URL}/api/v1/user/checkaccess/${documentId}`,
      method: "GET",
      withCredentials: true
    }).then((res) => {
      setdocDetails({
        "access": res.data.data.access,
        "docName": res.data.data.docName
      })
      if (res.data.data.access !== "viewer") {
        setviewOnly(false)
      }
      const s = io(`${process.env.REACT_APP_API_BASE_URL}`)
      setsocket(s)
      // console.log("connected to server");
    }).catch((err) => {
      navigate("/")
    })
    return () => {
      // console.log("disconnect")
      if (socket === undefined) return
      socket.disconnect()
    }
  }, []);

  // use to load doc
  useEffect(() => {
    if (socket === undefined || quill === undefined) return
    // server sends the doc to load it
    socket.once("load-document", documents => {
      quill.setContents(documents);
      if (viewOnly === false) {
        quill.enable()
      }
    })
    //to inform server that we are using this doc
    socket.emit("get-documnet", documentId)

  }, [socket, quill, documentId]);

  // used to save document
  // useEffect(() => {
  //   if (socket === undefined || quill === undefined) return
  //   const interval = setInterval(() => {
  //     socket.emit("doc-save", quill.getContents())
  //   }, SAVE_INTERVAL)
  //   return () => {
  //     clearInterval(interval)
  //   }
  // }, [socket, quill]);
  useEffect(() => {
    if (socket === undefined || quill === undefined || shouldSave === undefined) return
    let isCancelled = false;
    const saveDoc = async () => {
      document.getElementById("sync-icon").style.display = "block"
      document.getElementById("sync-done-icon").style.display = "none"
      await timeout(1000)
      if (!isCancelled) {
        socket.emit("doc-save", quill.getContents())
        document.getElementById("sync-icon").style.display = "none"
        document.getElementById("sync-done-icon").style.display = "block"
      }
    }
    saveDoc();
    return () => {
      isCancelled = true
    }

  }, [shouldSave]);

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
      setshouldSave(delta);
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
      // readOnly: true,
      theme: "snow"

    });
    q.disable();
    q.setText("Loading...");
    // q.editor.disable()
    setquill(q);
    return () => {
      if (wrapperRef.current === undefined || wrapperRef.current === null) return
      wrapperRef.current.innerHTML = "";
    };
  }, []);
  return (
    <>
      <TextEditorHeader docDetails={docDetails} />
      <div className="text-editor-container" ref={wrapperRef}></div>
    </>
  );
}
