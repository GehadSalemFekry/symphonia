import React, { createContext, useState } from "react";
import {
  createSong,
  getSongsByGroupId,
  updateSong,
  deleteSong,
  getSongTags,
  removeSongTag,
  addSongTag,
  likeSong,
  unlikeSong,
  addCommentToSong,
  deleteComment,
  getLikesBySongId,
  getCommentsBySongId,
} from "@/functions";

export const SongContext = createContext();

function SongProvider({ children }) {
  const [songs, setSongs] = useState([]);

  const handleCreateSong = async (groupId, name, author, coverImage, url) => {
    const { data, error } = await createSong(
      groupId,
      name,
      author,
      coverImage,
      url
    );
    if (data) {
      setSongs((prevSongs) => [...prevSongs, { ...data, tags: [] }]);
      return { success: true };
    }
    return { success: false, error };
  };

  const handleGetSongsByGroupId = async (groupId) => {
    const { data, error } = await getSongsByGroupId(groupId);
    if (!data) {
      return { success: false, error };
    }

    try {
      const updatedSongsWithTagsLikesComments = await Promise.all(
        data.map(async (song) => {
          const [
            { data: tagsData },
            { data: likesData },
            { data: commentsData },
          ] = await Promise.all([
            getSongTags(song.song_id),
            getLikesBySongId(song.song_id),
            getCommentsBySongId(song.song_id),
          ]);

          return {
            ...song,
            tags: tagsData || [],
            likes: likesData || [],
            comments: commentsData || [],
          };
        })
      );

      setSongs(updatedSongsWithTagsLikesComments);
      return { success: true };
    } catch (error) {
      console.error("Error fetching additional song data:", error);
      return { success: false, error };
    }
  };


  const handleUpdateSong = async (songId, name, author, coverImage) => {
    const { data, error } = await updateSong(songId, name, author, coverImage);
    if (data) {
      setSongs((prevSongs) =>
        prevSongs.map((song) =>
          song.song_id === songId
            ? {
                ...data,
                tags: song.tags,
                likes: song.likes,
                comments: song.comments,
              }
            : song
        )
      );
      return { success: true };
    }
    return { success: false, error };
  };

  const handleDeleteSong = async (songId) => {
    const { error } = await deleteSong(songId);

    if (!error) {
      setSongs((prevSongs) =>
        prevSongs.filter((song) => song.song_id !== songId)
      );
      return { success: true };
    }
    return { success: false, error };
  };

  // Function to add a tag to a song
  const handleAddSongTag = async (songId, tag) => {
    const { data, error } = await addSongTag(songId, tag);
    if (!data) {
      return { success: false, error };
    }

    // Update the songs state to include the new tag
    setSongs((prevSongs) =>
      prevSongs.map((song) =>
        song.song_id === songId ? { ...song, tags: [...song.tags, data] } : song
      )
    );
    return { success: true };
  };

  // Function to remove a tag from a song
  const handleRemoveSongTag = async (songId, tag) => {
    const { error } = await removeSongTag(songId, tag);
    if (error) {
      return { success: false, error };
    }

    // Update the songs state to remove the tag
    setSongs((prevSongs) =>
      prevSongs.map((song) =>
        song.song_id === songId
          ? { ...song, tags: song.tags.filter((t) => t.tag !== tag) }
          : song
      )
    );
    return { success: true };
  };

  const handleLikeSong = async (songId, userId) => {
    const { data, error } = await likeSong(songId, userId);
    console.log("data like", data, "error like", error);

    if (error) {
      return { success: false, error };
    }

    setSongs((prevSongs) =>
      prevSongs.map((song) =>
        song.song_id === songId
          ? { ...song, likes: [...song.likes, data] }
          : song
      )
    );
    return { success: true };
  };

  const handleUnlikeSong = async (songId, userId) => {
    const { error } = await unlikeSong(songId, userId);
    if (error) {
      return { success: false, error };
    }

    setSongs((prevSongs) =>
      prevSongs.map((song) =>
        song.song_id === songId
          ? {
              ...song,
              likes: song.likes.filter((like) => like.user_id !== userId),
            }
          : song
      )
    );
    return { success: true };
  };

  const handleAddCommentToSong = async (songId, userId, commentText) => {
    const { data, error } = await addCommentToSong(songId, userId, commentText);
    if (error) {
      return { success: false, error };
    }

    setSongs((prevSongs) =>
      prevSongs.map((song) =>
        song.song_id === songId
          ? { ...song, comments: [...song.comments, data] }
          : song
      )
    );
    return { success: true };
  };

  const handleDeleteComment = async (commentId) => {
    const { error } = await deleteComment(commentId);
    if (error) {
      return { success: false, error };
    }

    setSongs((prevSongs) =>
      prevSongs.map((song) => ({
        ...song,
        comments: song.comments.filter((comment) => comment.id !== commentId),
      }))
    );
    return { success: true };
  };

  return (
    <SongContext.Provider
      value={{
        songs,
        createSong: handleCreateSong,
        getSongsByGroupId: handleGetSongsByGroupId,
        updateSong: handleUpdateSong,
        deleteSong: handleDeleteSong,
        addSongTag: handleAddSongTag,
        removeSongTag: handleRemoveSongTag,
        likeSong: handleLikeSong,
        unlikeSong: handleUnlikeSong,
        addCommentToSong: handleAddCommentToSong,
        deleteComment: handleDeleteComment,
      }}
    >
      {children}
    </SongContext.Provider>
  );
}

export default SongProvider;
