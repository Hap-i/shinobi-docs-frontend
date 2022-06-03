import React from "react";
// import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import { grey } from "@mui/material/colors";
import AppsRoundedIcon from "@mui/icons-material/AppsRounded";
import Avatar from "@mui/material/Avatar";

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
  return (
    <>
      <div className="flex bg-white justify-between items-center p-2 mr-3">
        <div className="flex justify-center items-center">
          <div>
            <IconButton size="large">
              <MenuIcon />
            </IconButton>
          </div>
          <img className="cursor-pointer" src="logo.png" alt="" />
          <div className="text-2xl text-slate-500">Docs</div>
        </div>
        <div className="flex rounded-lg bg-slate-200 w-7/12 py-2 px-5 xl:w-6/12">
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
          <div>
            <Avatar {...stringAvatar("Suvendu Sahoo")} />
          </div>
        </div>
      </div>
    </>
  );
}
