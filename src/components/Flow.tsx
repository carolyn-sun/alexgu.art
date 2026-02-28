import React, { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";

const LQ_IMAGES_JSON = "/lqImages.json";
const COLUMN_COUNT = 4;
const IMAGE_COUNT = 16;

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

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    show: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 p-3 md:p-8 bg-zinc-100/20 dark:bg-white/[0.02] backdrop-blur-2xl rounded-[3rem] border border-black/[0.03] dark:border-white/[0.03] shadow-[0_24px_80px_-24px_rgba(0,0,0,0.1)]"
    >
      {columns.map((col, idx) => (
        <div
          key={idx}
          className={`flex flex-col gap-3 md:gap-6 ${idx % 2 === 1 ? "mt-8 md:mt-12" : ""}`}
        >
          {col.map((img, i) => (
            <motion.div
              key={i}
              variants={item}
              className="relative w-full overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem] bg-zinc-200 dark:bg-zinc-900 shadow-sm border border-black/5 dark:border-white/5"
              style={{
                aspectRatio:
                  (idx + i) % 3 === 0
                    ? "3/4"
                    : (idx + i) % 3 === 1
                      ? "1/1"
                      : "4/3",
              }}
            >
              <img
                src={img}
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-80 dark:opacity-60 transition-all duration-1000 ease-out"
                style={{
                  filter: "contrast(1.02) brightness(0.9) saturate(0.9)",
                }}
                loading="lazy"
              />
            </motion.div>
          ))}
        </div>
      ))}
    </motion.div>
  );
};

export default Flow;
