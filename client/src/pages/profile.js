import React, { useState } from 'react';
import UserProfile from '../components/groups/UpdateMemberDetails'; 
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
// import { ThemeProvider, CssBaseline } from '@mui/material/styles';
// import theme from '../theme'; 

function ProfilePage() {
  const user = {
    username: 'John Doe',
    email: 'john.doe@example.com',
    id: '1',
  };

  return (
    <div>
      {/* <ThemeProvider theme={theme}>
        <CssBaseline /> */}
        <Grid container justifyContent="center" alignItems="center" style={{ height: "100vh" }}>
          <Paper elevation={4} style={{ padding: "2rem" }}>
            <Typography variant="h5" align="center" gutterBottom>
              Profile
            </Typography>
            <UserProfile user={user} />
          </Paper>
        </Grid>
      {/* </ThemeProvider> */}
    </div>
  );
}

export default ProfilePage;