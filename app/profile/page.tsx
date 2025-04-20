import React from 'react';
import Link from 'next/link';

const ProfilePage = () => {
    const handleEditProfile = () => {
        // Logic for editing the profile can be added here
        console.log('Edit profile button clicked');
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Profile Page</h1>
            <div style={{ marginBottom: '20px' }}>
                <p>Welcome to your profile!</p>
                <button 
                    onClick={handleEditProfile} 
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#0070f3',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Edit Profile
                </button>
            </div>
            <nav>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li style={{ marginBottom: '10px' }}>
                        <Link href="/">
                            <a style={{ color: '#0070f3', textDecoration: 'none' }}>Home</a>
                        </Link>
                    </li>
                    <li>
                        <Link href="/settings">
                            <a style={{ color: '#0070f3', textDecoration: 'none' }}>Settings</a>
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default ProfilePage;