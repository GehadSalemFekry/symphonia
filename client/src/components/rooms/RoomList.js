import React, { useContext, useEffect } from "react";
import { RoomContext } from "@/contexts/RoomContext";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

const RoomList = () => {
  const { rooms, fetchRooms } = useContext(RoomContext);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  return (
    <List>
      {rooms.map((room) => (
        <ListItem button key={room.id}>
          <ListItemText primary={room.name} />
        </ListItem>
      ))}
    </List>
  );
};

export default RoomList;
