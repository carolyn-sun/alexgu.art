import { motion, type Variants } from "framer-motion";
import type React from "react";
import { useEffect, useState } from "react";

const LQ_IMAGES_JSON = "/lqImages.json";
const COLUMN_COUNT = 4;
const IMAGE_COUNT = 16;

function shuffle<T>(arr: T[]): T[] {
  return arr
    .map((v) => [Math.random(), v] as [number, T])
    .sort((a, b) => a[0] - b[0])
    .map(([, v]) => v);
}

// "/docs/<slug>/<base>_lq.jpeg" → series title from the gallery slug (same
// slug→title rule as the site pages).
function altFromPath(img: string): string {
  const slug = img.split("/")[2];
  if (!slug) return "Photography by Alexander Gu";
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
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
          key={`col-${idx}`}
          className={`flex-1 flex flex-col gap-3 md:gap-8 ${idx % 2 === 1 ? "mt-8 md:mt-12" : ""} ${idx >= 2 ? "hidden md:flex" : ""}`}
        >
          {col.map((img, i) => (
            <motion.div
              key={img}
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
                alt={altFromPath(img)}
                className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-out"
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
