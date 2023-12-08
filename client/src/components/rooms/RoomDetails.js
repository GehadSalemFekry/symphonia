import React, { useContext, useEffect } from "react";
import { RoomContext } from "@/contexts/RoomContext";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import AddSongForm from "@/components/rooms/AddSongForm";
import SongItem from "@/components/rooms/SongItem";

const RoomDetails = ({ roomId }) => {
  const { currentRoom, fetchRoomDetails, roomSongs } = useContext(RoomContext);

  useEffect(() => {
    fetchRoomDetails(roomId);
  }, [roomId, fetchRoomDetails]);

  return (
    <Box>
      <Typography variant="h4">{currentRoom?.name}</Typography>
      <AddSongForm roomId={roomId} />
      {roomSongs.map((song) => (
        <SongItem key={song.id} song={song} />
      ))}
    </Box>
  );
};

export default RoomDetails;
