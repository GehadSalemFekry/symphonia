import React, { useState, useContext } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Snackbar from "@/components/Snackbar";
import { updateUser } from "@/functions";
import { UserContext } from "@/context/UserContext.js";

function UserProfile() {
  const { user } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleEditClick = () => setIsEditing(true);

  const handleSaveClick = async () => {
    const { error } = await updateUser(username, email);
    if (error) {
      setError(error.message);
    } else {
      setIsEditing(false);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      {isEditing ? (
        <EditForm
          username={username}
          email={email}
          setUsername={setUsername}
          setEmail={setEmail}
          onSave={handleSaveClick}
        />
      ) : (
        <DisplayInfo
          username={username}
          email={email}
          onEdit={handleEditClick}
        />
      )}

      <Snackbar message={error} setMessage={setError} status="error" />
      <Snackbar message={success} setMessage={setSuccess} status="success" />
    </Box>
  );
}

function EditForm({ username, email, setUsername, setEmail, onSave }) {
  return (
    <>
      <TextField
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={onSave}
        sx={{ mt: 2 }}
      >
        Save
      </Button>
    </>
  );
}

function DisplayInfo({ username, email, onEdit }) {
  return (
    <>
      <Typography variant="subtitle1">Username: {username}</Typography>
      <Typography variant="subtitle1">Email: {email}</Typography>
      <Button variant="outlined" onClick={onEdit} sx={{ mt: 2 }}>
        Edit
      </Button>
    </>
  );
}

export default UserProfile;
