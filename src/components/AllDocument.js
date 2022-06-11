import React, { useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import { useAuth } from "../context/authContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AllDocument({ documents }) {
  const [value, setValue] = useState("one");
  const navigate = useNavigate();
  if (!documents) return;

  function openDoc(docId) {
    return function () {
      navigate(`/document/${docId}`, { replace: true })
    }
  }

  // const { user, setuser } = useAuth();
  // console.log(documents);
  // documents.map((doc) => {
  //   console.log(doc);
  // });

  const handleChange = (event, newValue) => {
    // console.log(newValue);
    setValue(newValue);
  };
  function filterDoc(doc) {
    // console.log("inside and value is: ", value);
    if (value === "one") {
      return true;
    } else if (value === "two" && doc.access === "owner") {
      return true;
    } else if (value === "three" && doc.access !== "owner") {
      return true;
    } else {
      return false;
    }
  }

  const filteredDocs = documents.filter(filterDoc);
  // console.log(filteredDocs);
  return (
    <>
      <section>
        <div className="max-w-3xl mx-auto pb-5">
          <Box sx={{ width: "100%" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              textColor="secondary"
              indicatorColor="secondary"
              aria-label="secondary tabs example"
            >
              <Tab value="one" label="ALL" />
              <Tab value="two" label="OWNED BY ME" />
              <Tab value="three" label="SHARED WITH ME" />
            </Tabs>
          </Box>
        </div>
      </section>
      <section>
        <div className="max-w-3xl mx-auto pb-5">
          {filteredDocs.map((doc) => {
            return (
              <div
                key={doc.documentId._id}
                className="flex items-center cursor-pointer justify-between 
                mt-4 py-1 px-4 rounded-3xl
                hover:bg-slate-200"
                onClick={openDoc(doc.documentId._id)}
              >
                <div className="flex items-center">
                  <img
                    className="object-contain h-8 w-auto"
                    src="logo.png"
                    alt="Logo"
                  />
                  <h3 className="px-3">{doc.documentId.title}</h3>
                </div>
                <div>
                  <IconButton>
                    <MoreVertIcon />
                  </IconButton>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
