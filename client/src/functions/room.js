import supabase from "./setup";

export async function createRoom(name, description) {
  // Create the room
  const { data, error } = await supabase
    .from("rooms")
    .insert([{ name, description }])
    .single();

  return { data, error: error ? Error(error.message) : null };
}

export async function getRoomById(roomId) {
  // Fetch the room details by ID
  if (!roomId) {
    return { data: null, error: Error("Missing room id") };
  }

  const { data, error } = await supabase
    .from("rooms")
    .select()
    .eq("id", roomId)
    .single();

  return { data, error };
}

export async function updateRoomState(roomId, newState) {
  // Update room state
  const { data, error } = await supabase
    .from("rooms")
    .update(newState)
    .eq("id", roomId)
    .single();

  return { data, error: error ? Error(error.message) : null };
}

export async function addSongToRoom(roomId, song) {
  // Add a song to the room's playlist
  const { data, error } = await supabase
    .from("room_songs")
    .insert([{ room_id: roomId, ...song }])
    .single();

  return { data, error: error ? Error(error.message) : null };
}

export async function getSongsByRoomId(roomId) {
  // Fetch the songs in the room
  if (!roomId) {
    return { data: null, error: Error("Missing room id") };
  }

  const { data, error } = await supabase
    .from("room_songs")
    .select()
    .eq("room_id", roomId);

  return { data, error };
}

export async function deleteSongFromRoom(songId) {
  // Delete the song from the room
  const { error } = await supabase.from("room_songs").delete().eq("id", songId);

  return { error: error ? Error(error.message) : null };
}
