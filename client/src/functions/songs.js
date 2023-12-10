import supabase from "./setup";

export async function createSong(groupId, name, author, coverImage, url) {
  // Create the song
  const { data, error } = await supabase
    .from("songs")
    .insert([{ group_id: groupId, cover_image: coverImage, name, author, url }])
    .select()
    .single();

  return { data, error: error ? Error(error.message) : null };
}

export async function getSongsByGroupId(groupId) {
  // Validate input
  if (!groupId) {
    return { data: null, error: Error("Missing group id") };
  }

  // Fetch the songs in the groups
  const { data, error } = await supabase
    .from("songs")
    .select()
    .eq("group_id", groupId);

  return { data, error };
}

export async function updateSong(songId, name, author, coverImage) {
  // Update song details
  const { data, error } = await supabase
    .from("songs")
    .update({ cover_image: coverImage, name, author })
    .eq("song_id", songId)
    .select()
    .single();

  return { data, error: error ? Error(error.message) : null };
}

export async function deleteSong(songId) {
  // Delete the song
  const { error } = await supabase.from("songs").delete().eq("song_id", songId);

  const err = error ? Error(error.message) : null;
  return { data: null, err };
}

export async function searchSongsByName(groupId, searchTerm) {
  // Validate input
  if (!groupId) {
    return { data: null, error: Error("Missing group id") };
  }
  if (!searchTerm) {
    return { data: null, error: Error("Missing search term") };
  }

  // Use the ilike operator to search for songs by name
  const { data, error } = await supabase
    .from("songs")
    .select()
    .eq("group_id", groupId)
    .ilike("name", `%${searchTerm}%`);

  return { data, error: error ? Error(error.message) : null };
}

export async function likeSong(songId, userId) {
  const { data, error } = await supabase
    .from("likes")
    .insert([{ song_id: songId, user_id: userId }])
    .select()
    .single();

  return { data, error: error ? Error(error.message) : null };
}

export async function unlikeSong(songId, userId) {
  const { error } = await supabase
    .from("likes")
    .delete()
    .match({ song_id: songId, user_id: userId })
    .select();

  return { error: error ? Error(error.message) : null };
}

export async function addCommentToSong(songId, userId, commentText) {
  const { data, error } = await supabase
    .from("comments")
    .insert([{ song_id: songId, user_id: userId, comment_text: commentText }])
    .single()
    .select();

  return { data, error: error ? Error(error.message) : null };
}

export async function deleteComment(commentId) {
  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId)
    .select();

  return { error: error ? Error(error.message) : null };
}

export async function getCommentsBySongId(songId) {
  const { data, error } = await supabase
    .from("comments")
    .select()
    .eq("song_id", songId);

  return { data, error };
}

export async function getLikesBySongId(songId) {
  const { data, error } = await supabase
    .from("likes")
    .select("*")
    .eq("song_id", songId);

  return { data, error };
}
