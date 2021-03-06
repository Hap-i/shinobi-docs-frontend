import React from "react";
// import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import { grey } from "@mui/material/colors";
import AppsRoundedIcon from "@mui/icons-material/AppsRounded";
import Avatar from "@mui/material/Avatar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import Modal from "@mui/material/Modal";
import { useAuth } from "../context/authContext";
// axios.defaults.withCredentials = true;

const style = {
  position: "absolute",
  top: "19%",
  left: "82%",
  transform: "translate(-50%, -50%)",
  width: 400,
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

export default function Header() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const navigate = useNavigate();
  const { user, setuser } = useAuth()
  // if (user.name === undefined || user.name === null) return
  if (!user) return
  function createNewDocument() {
    axios({
      url: `${process.env.REACT_APP_API_BASE_URL}/api/v1/document`,
      method: "POST",
      data: {
        data: {},
      },
      withCredentials: true,
    })
      .then((res) => {
        navigate(`/document/${res.data.data.id}`);
      })
      .catch((err) => {
      });
  }

  function handleLogout() {
    axios({
      url: `${process.env.REACT_APP_API_BASE_URL}/api/v1/user/logout`,
      method: "GET",
      withCredentials: true,
    })
      .then((res) => {
        setuser(undefined)
        navigate("/signin", { replace: true });
      })
      .catch((err) => {
      });
  }
  return (
    <>
      <div className="flex bg-white justify-between items-center p-2 mr-4">
        <div className="flex justify-center items-center">
          <div>
            <IconButton size="large">
              <MenuIcon />
            </IconButton>
          </div>
          <img
            className="cursor-pointer object-contain h-10 w-auto"
            src="logo.png"
            alt="Logo"
          />
          <div className="text-2xl text-slate-500">Docs</div>
        </div>
        <div className="hidden sm:flex rounded-lg bg-slate-200 w-7/12 py-2 px-5 xl:w-6/12">
          <div className="pr-3">
            <SearchIcon sx={{ color: grey[700] }} />
          </div>
          <div>
            <InputBase placeholder="Search" />
          </div>
        </div>
        <div className="flex items-center">
          <div>
            <IconButton size="large">
              <AppsRoundedIcon />
            </IconButton>
          </div>
          <div className="cursor-pointer" onClick={handleOpen}>
            <Avatar {...stringAvatar(user.name !== undefined ? user.name.toUpperCase() : "Shinobi Docs")} />
          </div>
        </div>
      </div>
      <section className="bg-[#F1F3F4]">
        <div className="max-w-3xl mx-auto pb-5">
          <div className="px-2 py-4">
            <h2>Start a new document</h2>
          </div>
          <div className="flex px-2">
            <div className="relative h-50 w-40">
              <img
                className="border-2 hover:border-blue-500 cursor-pointer object-contain h-50 w-40"
                src="docs-blank-googlecolors.png"
                alt="create document"
                onClick={createNewDocument}
              />
              <h3 className="p-2">Blank</h3>
            </div>
          </div>
        </div>
      </section>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style} className="space-x-6">
          <Button variant="contained" startIcon={<PersonIcon />}>
            My Profile
          </Button>
          <Button
            onClick={handleLogout}
            variant="contained"
            startIcon={<LogoutIcon />}
          >
            Logout
          </Button>
        </Box>
      </Modal>
    </>
  );
}
