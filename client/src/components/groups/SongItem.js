import React, { useState, useContext, useEffect } from "react";
import { styled } from "@mui/system";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import CommentIcon from "@mui/icons-material/Comment";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { SongContext } from "@/context/SongContext";
import { UserContext } from "@/context/UserContext";
import Snackbar from "@/components/Snackbar";
import SpotifyEmbed from "@/components/SpotifyEmbed";

const SongListItem = styled(ListItem)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  display: `flex`,
  flexDirection: `column`,
}));

function SongItem({ song, onDelete }) {
  const [newTag, setNewTag] = useState("");
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isCommentsDialogOpen, setIsCommentsDialogOpen] = useState(false);

  const {
    addSongTag,
    removeSongTag,
    likeSong,
    unlikeSong,
    addCommentToSong,
    deleteComment,
  } = useContext(SongContext);
  const { user } = useContext(UserContext);

  const [isLiked, setIsLiked] = useState(false);
  useEffect(() => {
    const userAlreadyLikedSong = song.likes.some(
      (like) => like.user_id == user.user_id
    );
    setIsLiked(userAlreadyLikedSong);
  }, []);

  const handleAddTag = async () => {
    if (newTag.trim()) {
      const { error } = await addSongTag(song.song_id, newTag);
      if (error) {
        setError(error.message); // Handle error (e.g., show an error message)
      } else {
        setSuccess("Tag added successfully!");
      }

      setNewTag("");
    }
  };

  const handleDeleteTag = async (songId, tag) => {
    const { error } = await removeSongTag(songId, tag);
    if (error) {
      setError(error.message); // Handle error (e.g., show an error message)
    } else {
      setSuccess("Tag removed successfully!");
    }
  };

  const handleLikeSong = async () => {
    // Check if the user already liked the song

    if (isLiked) {
      // If the user already liked the song, unlike it
      const { error } = await unlikeSong(song.song_id, user.user_id);
      if (error) setError(error.message);
      else {
        setSuccess("Song unliked successfully!");
        setIsLiked(false);
      }
    } else {
      // If the user didn't like the song, like it
      const { error } = await likeSong(song.song_id, user.user_id);
      if (error) setError(error.message);
      else {
        setSuccess("Song liked successfully!");
        setIsLiked(true);
      }
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (newComment.trim()) {
      const { error } = await addCommentToSong(
        song.song_id,
        user.user_id,
        newComment
      );
      if (error) setError(error.message);
      else {
        setSuccess("Comment added successfully!");
        setNewComment("");
        handleCloseCommentsDialog();
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    const { error } = await deleteComment(commentId);
    if (error) setError(error.message);
    else setSuccess("Comment deleted successfully!");
  };

  const iconStyle = isLiked
    ? { color: "primary" }
    : { color: "gray", opacity: 0.5 };

  const handleOpenCommentsDialog = () => {
    setIsCommentsDialogOpen(true);
  };

  const handleCloseCommentsDialog = () => {
    setIsCommentsDialogOpen(false);
  };

  return (
    <SongListItem>
      <Box sx={{ width: `100%`, display: `flex` }}>
        <Box sx={{ display: "flex", gap: 2, flexGrow: 1 }}>
          {song.url && <SpotifyEmbed link={song.url} wide />}
          <Box>
            {!song.url && (
              <>
                <Typography variant="h6">{song.name}</Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  {song.author}
                </Typography>
              </>
            )}

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {song?.tags?.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag.tag}
                  onDelete={() => handleDeleteTag(song.song_id, tag.tag)}
                />
              ))}
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography color="textSecondary">{song.likes.length}</Typography>

          <IconButton onClick={handleLikeSong}>
            <ThumbUpIcon style={iconStyle} />
          </IconButton>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <IconButton onClick={handleOpenCommentsDialog}>
              <Badge badgeContent={song.comments.length} color="primary">
                <CommentIcon />
              </Badge>
            </IconButton>

            <IconButton
              color="primary"
              aria-label="Add tag"
              onClick={handleAddTag}
            >
              <AddIcon />
            </IconButton>
            <TextField
              label="Tag"
              size="small"
              variant="outlined"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              sx={{ width: "8rem" }}
            />
          </Box>
          <IconButton
            edge="end"
            aria-label="Delete song"
            onClick={() => onDelete(song.song_id)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>

      <Dialog
        open={isCommentsDialogOpen}
        onClose={handleCloseCommentsDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Comments</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              maxHeight: 300,
              overflowY: "auto",
            }}
          >
            {song.comments.map((comment, index) => (
              <Box
                key={index}
                sx={{
                  my: 1,
                  p: 2,
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="body2" sx={{ flexGrow: 1, mr: 1 }}>
                  {comment.comment_text}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>

          <Box
            component="form"
            onSubmit={handleAddComment}
            sx={{ mt: 2, display: "flex", alignItems: "center" }}
          >
            <TextField
              fullWidth
              label="Add a comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              variant="outlined"
              size="small"
              sx={{ mr: 2 }}
            />
            <Button type="submit" variant="contained" color="primary">
              Add
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCommentsDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar message={error} setMessage={setError} status="error" />
      <Snackbar message={success} setMessage={setSuccess} status="success" />
    </SongListItem>
  );
}

export default SongItem;
