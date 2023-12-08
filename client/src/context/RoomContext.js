import React, { createContext, useState } from "react";
import {
  createRoom,
  getRoomById,
  updateRoomState,
  addSongToRoom,
  getSongsByRoomId,
  deleteSongFromRoom,
} from "@/functions";

export const RoomContext = createContext();

function RoomProvider({ children }) {
  const [currentRoom, setCurrentRoom] = useState(null);
  const [roomSongs, setRoomSongs] = useState([]);

  const handleCreateRoom = async (name, description) => {
    const { data, error } = await createRoom(name, description);
    if (data) {
        setCurrentRoom(data);
        return { success: true };
    }
    return { success: false, error };
  };

  const handleGetRoomById = async (roomId) => {
    const { data, error } = await getRoomById(roomId);
    if (data) {
        setCurrentRoom(data);
        return { success: true };
    } 
    return { success: false, error };
  };

  const handleUpdateRoomState = async (roomId, newState) => {
    const { data, error } = await updateRoomState(roomId, newState);
    if (data) {
        setCurrentRoom(data);
        return { success: true };
    }
    return { success: false, error };
  };

  const handleAddSongToRoom = async (roomId, song) => {
    const { error } = await addSongToRoom(roomId, song);
    if (error) {
        return { success: false, error };
    } 
    setRoomSongs((prevSongs) => [...prevSongs, song]);
    return { success: true };
  };

  const handleGetSongsByRoomId = async (roomId) => {
    const { data, error } = await getSongsByRoomId(roomId);
    if (data) {
        setRoomSongs(data);
        return { success: true };
    }
    return { success: false, error };
  };

  const handleDeleteSongFromRoom = async (songId) => {
    const { error } = await deleteSongFromRoom(songId);

    if (error) {
        return { success: false, error };
    } 
    setRoomSongs((prevSongs) =>
        prevSongs.filter((song) => song.id !== songId)
    );
    return { success: true };
  };

  return (
    <RoomContext.Provider
      value={{
        currentRoom,
        roomSongs,
        error,
        createRoom: handleCreateRoom,
        getRoomById: handleGetRoomById,
        updateRoomState: handleUpdateRoomState,
        addSongToRoom: handleAddSongToRoom,
        getSongsByRoomId: handleGetSongsByRoomId,
        deleteSongFromRoom: handleDeleteSongFromRoom,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};


export default RoomProvider;