import React, { useContext, useState } from "react";
import { useRouter } from "next/router";
import Container from "@mui/material/Container";
import { UserContext } from "@/context/UserContext";
import { updateGroupDetails } from "@/functions";
import Header from "@/components/Header";
import GroupList from "@/components/groups/GroupList";
import GroupDetails from "@/components/groups/GroupDetails";
import MemberList from "@/components/groups/MemberList";
import Snackbar from "@/components/Snackbar";

function GroupPage() {
  const { user } = useContext(UserContext);
  const router = useRouter();
  const groupId = router.query.id;

  const [newName, setNewName] = useState('');
  const [removedSongs, setSongsToRemove] = useState([]);
  const [removedMembers, setMembersToRemove] = useState([]);

  // State variables for error and success messages
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleEditGroup = async () => {
    const result = await updateGroupDetails(groupId, newName,removedSongs, removedMembers);
    if (result.error) {
      setError(result.error);
    } else {
      setSuccess('Group details updated successfully');
    }
  };

  return (
    <div>
      {/* Form inputs for new group details */}
      <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="New group name" />
      {/* Add similar inputs for songsToRemove, songsToAdd, membersToRemove, membersToAdd */}

       <button onClick={handleEditGroup}>Edit Group</button>

      {/* Error and success messages */}
      <Snackbar message={error} setMessage={setError} status="error" />
      <Snackbar message={success} setMessage={setSuccess} status="success" />
      <Header />

      {user && (
        <div style={{ display: "flex", paddingTop: "64px" }}>
          <GroupList />

          <Container>
            <GroupDetails groupId={groupId} />
          </Container>

          <MemberList groupId={groupId} />
        </div>
      )}
    </div>
  );
}

  // TODO: In all event handlers, need to update database
  // TODO: Use id of the group to fetch group data

  

export default GroupPage;
