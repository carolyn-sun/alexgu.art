import React, { useEffect, useState } from "react";

const LQ_IMAGES_JSON = "/lqImages.json";
const COLUMN_COUNT = 3;
const IMAGE_COUNT = 12;

function shuffle<T>(arr: T[]): T[] {
  return arr
    .map((v) => [Math.random(), v] as [number, T])
    .sort((a, b) => a[0] - b[0])
    .map(([, v]) => v);
}

const Flow: React.FC = () => {
  const [columns, setColumns] = useState<string[][]>([]);

  useEffect(() => {
    fetch(LQ_IMAGES_JSON)
      .then((res) => res.json())
      .then((images: string[]) => {
        const picked = shuffle(images).slice(0, IMAGE_COUNT);
        const cols: string[][] = Array.from({ length: COLUMN_COUNT }, () => []);
        picked.forEach((img, i) => {
          cols[i % COLUMN_COUNT].push(img);
        });
        setColumns(cols);
      });
  }, []);

  return (
    <div
      style={{
        display: "flex",
        gap: 16,
        padding: 16,
        background: "#fafbfc",
        borderRadius: 16,
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
      }}
    >
      {columns.map((col, idx) => (
        <div
          key={idx}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {col.map((img, i) => (
            <div
              key={i}
              style={{
                position: "relative",
                width: "100%",
                height: 160,
                overflow: "hidden", // 裁剪超出部分
                borderRadius: 12,
                boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
              }}
            >
              <img
                src={img}
                alt=""
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: "150%",
                  height: "150%",
                  transform: "translate(-50%, -50%)",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Flow;
