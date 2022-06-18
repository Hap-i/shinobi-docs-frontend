import React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import LockIcon from "@mui/icons-material/Lock";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { useNavigate, useParams } from "react-router-dom";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import EditableLabel from "react-inline-editing";
import CloudDoneIcon from "@mui/icons-material/CloudDone";
import CloudSyncIcon from "@mui/icons-material/CloudSync";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
}

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
}

export default function TextEditorHeader({ docDetails }) {
  const [open, setOpen] = React.useState(false);
  const [access, setaccess] = React.useState(""); // for sharing email
  const [shareEmail, setshareEmail] = useState("");
  const navigate = useNavigate();
  const { id: documentId } = useParams();
  if (!docDetails) return;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleAccessType = (event) => {
    setaccess(event.target.value);
  };
  const handleEmail = (event) => {
    setshareEmail(event.target.value);
  };
  const sendDoc = () => {
    axios({
      url: `${process.env.REACT_APP_API_BASE_URL}/api/v1/document/share/${documentId}`,
      method: "POST",
      data: {
        email: shareEmail,
        access: access,
      },
      withCredentials: true,
    })
      .then((res) => {
        setaccess("");
        document.getElementById("filled-basic").value = "";
      })
      .catch((err) => { });
  };

  function handleFocusOut(text) {
    axios({
      url: `${process.env.REACT_APP_API_BASE_URL}/api/v1/document/${documentId}`,
      method: "PATCH",
      data: {
        name: text,
      },
      withCredentials: true,
    })
      .then((res) => {
        docDetails.docName = text;
      })
      .catch((err) => { });
  }
  return (
    <>
      <div className="flex justify-between items-center">
        <div className="flex py-2 px-4">
          <div className="cursor-pointer" onClick={() => navigate("/")}>
            <img src="/logo.png" alt="logo" />
          </div>
          <div className="pl-3">
            <div className="flex items-center">
              <div className="text-lg">
                {docDetails.access === "owner" ? (
                  <EditableLabel
                    text={docDetails.docName}
                    labelClassName="myLabelClass"
                    inputClassName="myInputClass"
                    inputWidth="200px"
                    inputHeight="25px"
                    inputMaxLength={50}
                    inputBorderWidth="1px"
                    onFocusOut={handleFocusOut}
                  />
                ) : (
                  <div>{docDetails.docName}</div>
                )}
              </div>
              <div id="sync-icon" className="pl-2 hidden">
                <CloudSyncIcon color="primary" />
              </div>
              <div id="sync-done-icon" className="pl-2">
                <CloudDoneIcon color="success" />
              </div>
            </div>
            <div className="flex space-x-4 pt-1">
              <ol>File</ol>
              <ol>Edit</ol>
              <ol>About</ol>
              <ol>Help</ol>
            </div>
          </div>
        </div>
        <div className="flex mr-8">
          <div className="pr-4">
            <Button
              variant="contained"
              size="medium"
              startIcon={<LockIcon fontSize="small" />}
              onClick={handleOpen}
              disabled={docDetails.access !== "owner"}
            >
              Share
            </Button>
          </div>
          <div>
            <Avatar {...stringAvatar("Suvendu Sahoo")} />
          </div>
        </div>
      </div>
      <hr className="border-gray-300" />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Share `{docDetails.docName}`
          </Typography>
          <div className=" flex mt-5 items-center justify-between">
            <TextField
              id="filled-basic"
              sx={{ m: 1, width: "30ch" }}
              label="Email"
              variant="standard"
              onChange={handleEmail}
            />
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-standard-label">
                Access
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={access}
                onChange={handleAccessType}
                label="access"
              >
                <MenuItem value={"editor"}>Editor</MenuItem>
                <MenuItem value={"viewer"}>Viewer</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="flex justify-end pt-5">
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              onClick={sendDoc}
            >
              Share
            </Button>
          </div>
        </Box>
      </Modal>
    </>
  );
}
