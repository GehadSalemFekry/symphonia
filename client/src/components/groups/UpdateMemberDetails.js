import React, { useState, useContext } from 'react';
import { updateUser } from '@/functions/member.js'; // import the updateUser function
import { UserContext } from '@/context/UserContext.js';

function UserProfile() {
    const { user } = useContext(UserContext);

    const [isEditing, setIsEditing] = useState(false);
    const [username, setUsername] = useState(user.username);
    const [email, setEmail] = useState(user.email);
    const [errors, setErrors] = useState({});

    console.log(user)
    const handleEditClick = () => {
        setIsEditing(true);
    };

    const validateForm = () => {
        let formErrors = {};
        if (!username) formErrors.username = "Username is required";
        if (!email) {
            formErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            formErrors.email = "Email address is invalid";
        }
        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleSaveClick = async () => {
        if (!validateForm()) return;
        const { data, error } = await updateUser(user.user_id, username, email);
        if (error) {
            console.error(error);
        } else {
            setIsEditing(false);
        }
    };

    return (
        <div>
            {isEditing ? (
                <>
                    <input value={username} onChange={e => setUsername(e.target.value)} />
                    {errors.username && <p>{errors.username}</p>}
                    <input value={email} onChange={e => setEmail(e.target.value)} />
                    {errors.email && <p>{errors.email}</p>}
                    <button onClick={handleSaveClick}>Save</button>
                </>
            ) : (
                <>
                    <p>Username: {username}</p>
                    <p>Email: {email}</p>
                    <button onClick={handleEditClick}>Edit</button>
                </>
            )}
        </div>
    );
}

export default UserProfile;