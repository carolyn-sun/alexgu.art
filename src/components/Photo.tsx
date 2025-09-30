import React, { useState, useEffect } from "react";

interface ExifData {
  [key: string]: any;
  _pre_url: string;
}

interface PhotoProps {
  lqip?: string;
  json: ExifData;
}

const getLqipSrc = (src: string) => {
  const extIdx = src.lastIndexOf(".");
  if (extIdx === -1) return src + "_lq.jpeg";
  return src.slice(0, extIdx) + "_lq.jpeg";
};

const Photo: React.FC<PhotoProps> = ({ lqip, json }) => {
  const [src, setSrc] = useState<string>("");
  const [showOriginal, setShowOriginal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>(lqip || "");
  const [hover, setHover] = useState(false);

  useEffect(() => {
    // Dynamically load the _pre_url at runtime
    if (json && json._pre_url) {
      setSrc(json._pre_url);
      if (!lqip) {
        setImgSrc(getLqipSrc(json._pre_url));
      }
    }
  }, [json, lqip]);

  const handleClick = () => {
    if (!showOriginal && src) {
      setLoading(true);
      const originalImg = new window.Image();
      originalImg.src = src;
      originalImg.onload = () => {
        setImgSrc(src);
        setLoading(false);
        setShowOriginal(true);
      };
      originalImg.onerror = () => {
        setLoading(false);
      };
    }
  };

  return (
    <div
      style={{ position: "relative", display: "inline-block", width: "100%" }}
    >
      <div
        style={{ position: "relative", display: "inline-block", width: "100%" }}
      >
        <img
          src={imgSrc}
          alt="photo"
          style={{
            maxWidth: "100%",
            borderRadius: 8,
            boxShadow: "0 2px 8px #ccc",
            display: "block",
            cursor: showOriginal ? "default" : "pointer",
            filter: showOriginal ? "none" : "blur(0.5px)",
          }}
          onClick={handleClick}
          draggable={false}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        />
        {!showOriginal && hover && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -120%)",
              background: "rgba(40,40,40,0.92)",
              color: "#fff",
              padding: "6px 16px",
              borderRadius: 6,
              fontSize: 14,
              pointerEvents: "none",
              zIndex: 10,
              whiteSpace: "nowrap",
              boxShadow: "0 2px 8px #0002",
            }}
          >
            Click to see high-res photo :-)
          </div>
        )}
        {loading && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,255,255,0.4)",
              zIndex: 2,
            }}
          >
            <span
              style={{
                width: 40,
                height: 40,
                border: "4px solid #bbb",
                borderTop: "4px solid #333",
                borderRadius: "50%",
                display: "inline-block",
                animation: "spin 1s linear infinite",
                background: "transparent",
              }}
            />
            <style>{`
                            @keyframes spin {
                                0% { transform: rotate(0deg); }
                                100% { transform: rotate(360deg); }
                            }
                        `}</style>
          </div>
        )}
      </div>
      {json && (
        <table
          style={{
            marginTop: 12,
            borderCollapse: "collapse",
            width: "100%",
            fontSize: "14px",
            fontFamily: "Saira",
            fontWeight: 600,
          }}
        >
          <tbody>
            {Object.entries(json)
              .filter(([key]) => !key.startsWith("_")) // Filter out keys starting with '_'
              .map(([key, value]) => (
                <tr key={key}>
                  <td
                    style={{
                      padding: "4px 8px",
                      borderBottom: "1px solid #eee",
                      width: 160,
                    }}
                  >
                    {key}
                  </td>
                  <td
                    style={{
                      padding: "4px 8px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    {String(value)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Photo;
