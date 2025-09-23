import React from 'react';

interface AvatarProps {
}

const Avatar: React.FC<AvatarProps> = () => (
    <img
        src="/img/avatar.jpg"
        alt="avatar"
        style={{
            width: 64,
            height: 64,
            borderRadius: 8,
            boxShadow: '0 2px 8px #ccc',
            border: '2px solid #eee',
            objectFit: 'cover',
            display: 'inline-block',
        }}
    />
);

export default Avatar;