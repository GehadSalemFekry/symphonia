import React, { useContext } from "react";
import UserProfile from "@/components/groups/UserProfile";
import Header from "@/components/Header";
import GroupList from "@/components/groups/GroupList";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { UserContext } from "@/context/UserContext";

function ProfilePage() {
  const { user } = useContext(UserContext);

  return (
    <div>
      <Header />

      {user && (
        <div style={{ display: "flex", paddingTop: "64px" }}>
          <GroupList />

          <Grid
            container
            justifyContent="center"
            alignItems="center"
            style={{ height: "calc(100vh - 64px)" }}
          >
            <Paper elevation={4} style={{ padding: "2rem" }}>
              <Typography variant="h5" align="center" gutterBottom>
                Profile
              </Typography>
              <UserProfile />
            </Paper>
          </Grid>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
