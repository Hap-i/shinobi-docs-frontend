import React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import LockIcon from "@mui/icons-material/Lock";

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

export default function TextEditorHeader() {
  return (
    <>
      <div className="flex justify-between items-center">
        <div className="flex py-2 px-4">
          <div>
            <img src="/logo.png" alt="logo" />
          </div>
          <div className="pl-3">
            <div className="text-lg">New Document</div>
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
    </>
  );
}
