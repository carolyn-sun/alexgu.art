import { AnimatePresence, motion } from "framer-motion";
import type React from "react";
import { useEffect, useState } from "react";

interface ExifData {
  [key: string]: any;
  _pre_url: string;
}

interface PhotoProps {
  lqip?: string | { src: string };
  json: ExifData;
}

const getLqipSrc = (src: string) => {
  const extIdx = src.lastIndexOf(".");
  if (extIdx === -1) return `${src}_lq.jpeg`;
  return `${src.slice(0, extIdx)}_lq.jpeg`;
};

const Photo: React.FC<PhotoProps> = ({ lqip, json }) => {
  const [src, setSrc] = useState<string>("");
  const [showOriginal, setShowOriginal] = useState(false);
  const [loading, setLoading] = useState(false);
  const getExtractedLqip = () => {
    if (!lqip) return "";
    if (typeof lqip === "string") return lqip;
    if (typeof lqip === "object" && lqip !== null) {
      if ("src" in lqip) return (lqip as any).src;
      if ("default" in lqip) {
        const d = (lqip as any).default;
        if (typeof d === "string") return d;
        if (typeof d === "object" && d !== null && "src" in d) return d.src;
      }
    }
    return String(lqip);
  };
  const initialLqip = getExtractedLqip();
  const [imgSrc, setImgSrc] = useState<string>(initialLqip);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    if (json?._pre_url) {
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
    <div className="relative w-full my-20 group overflow-visible">
      <motion.div
        layout
        className="relative overflow-hidden rounded-2xl shadow-2xl bg-zinc-100 dark:bg-zinc-900 border border-black/5 dark:border-white/5"
      >
        <motion.img
          src={imgSrc}
          alt="Photography gallery item"
          className="w-full h-auto block"
          style={{
            cursor: showOriginal ? "default" : "pointer",
            filter: showOriginal
              ? "none"
              : "blur(1px) brightness(0.85) saturate(0.8)",
            transition: "filter 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          onClick={handleClick}
          draggable={false}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          animate={{ scale: hover && !showOriginal ? 1.01 : 1 }}
          transition={{ duration: 0.4 }}
        />

        <AnimatePresence>
          {!showOriginal && hover && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 10, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 10, x: "-50%" }}
              className="absolute bottom-10 left-1/2 bg-white/10 backdrop-blur-xl text-white px-8 py-4 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase z-10 pointer-events-none shadow-2xl border border-white/20"
            >
              Reveal High-Res
            </motion.div>
          )}
        </AnimatePresence>

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm z-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="w-10 h-10 border-[3px] border-white/20 border-t-white rounded-full"
            />
          </div>
        )}
      </motion.div>

      {json && (
        <motion.div className="mt-8 p-6 md:p-8 rounded-2xl bg-white/5 dark:bg-zinc-900/40 backdrop-blur-sm border border-zinc-200/50 dark:border-zinc-800/50">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 gap-y-8">
            {Object.entries(json)
              .filter(([key]) => !key.startsWith("_"))
              .map(([key, value]) => (
                <div key={key} className="flex flex-col gap-2">
                  <span className="uppercase tracking-[0.15em] text-zinc-400 dark:text-zinc-500 font-black text-[9px]">
                    {key}
                  </span>
                  <span
                    className="font-bold text-zinc-900 dark:text-zinc-100 text-xs tracking-tight break-words"
                    style={{ fontFamily: "'Saira Variable', sans-serif" }}
                  >
                    {String(value)}
                  </span>
                </div>
              ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Photo;
