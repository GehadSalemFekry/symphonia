// CreateRoomForm.js
import React, { useState, useContext } from "react";
import { RoomContext } from "@/contexts/RoomContext";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

const CreateRoomForm = () => {
  const [roomName, setRoomName] = useState("");
  const { createRoom } = useContext(RoomContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createRoom(roomName);
    setRoomName("");
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        label="Room Name"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
      />
      <Button type="submit">Create Room</Button>
    </Box>
  );
};

export default CreateRoomForm;
