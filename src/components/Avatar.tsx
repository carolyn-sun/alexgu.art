import React from 'react';

interface AvatarProps {
    src: string;
}

const Avatar: React.FC<AvatarProps> = ({src}) => (
    <img
        src={src}
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