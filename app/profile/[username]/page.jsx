"use client"

import { useState, useEffect } from 'react';

const Page = ({ params }) => {
    const username = params?.username;
    const [profileData, setProfileData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await fetch(`/api/v1/profile/${username}`, { method: "GET" });
                
                if (!response.ok) {
                    throw new Error("Failed to fetch profile");
                }

                const data = await response.json();
                setProfileData(data);
            } catch (err) {
                setError(err.message);
            }
        };

        if (username) fetchProfileData();
    }, [username]);

    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>Profile of {username}</h1>
            {profileData ? (
                <div>
                    <p>Username: {profileData.username}</p>
                    <p>Email: {profileData.email}</p>
                    {/* Add more profile fields as needed */}
                </div>
            ) : (
                <p>Loading profile...</p>
            )}
        </div>
    );
};

export default Page;
