import React from 'react';

interface ExifData {
    [key: string]: any;
}

interface PhotoProps {
    src: string;
    json?: ExifData;
}

const Photo: React.FC<PhotoProps> = ({ src, json }) => {
    return (
        <div>
            <img src={src} alt="photo" style={{ maxWidth: '100%', borderRadius: 8, boxShadow: '0 2px 8px #ccc' }} />
            {json && (
                <table style={{ marginTop: 12,
                    borderCollapse: 'collapse',
                    width: '100%',
                    fontSize: '14px',
                    fontFamily: 'Saira'}}>
                    <tbody>
                        {Object.entries(json).map(([key, value]) => (
                            <tr key={key}>
                                <td style={{
                                    padding: '4px 8px',
                                    borderBottom: '1px solid #eee',
                                    width: 160
                                }}>{key}</td>
                                <td style={{ padding: '4px 8px', borderBottom: '1px solid #eee' }}>{String(value)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Photo;