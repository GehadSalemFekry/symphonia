import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

const AddSongForm = ({ roomId }) => {
  const [songName, setSongName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to add song to room
    setSongName("");
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        label="Song Name"
        value={songName}
        onChange={(e) => setSongName(e.target.value)}
      />
      <Button type="submit">Add Song</Button>
    </Box>
  );
};

export default AddSongForm;
