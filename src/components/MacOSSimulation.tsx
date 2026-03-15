import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Photo {
  name: string;
  url: string;
}

interface Gallery {
  slug: string;
  title: string;
  coverUrl: string;
  photos: Photo[];
}

interface WindowProps {
  id: string;
  title: string;
  type: "folder" | "preview" | "root" | "settings" | "mail";
  content: any;
  zIndex: number;
  onClose: (id: string) => void;
  onFocus: (id: string) => void;
  initialPos: { x: number; y: number };
}

const MacOSWindow: React.FC<WindowProps> = ({
  id,
  title,
  type,
  content,
  zIndex,
  onClose,
  onFocus,
  initialPos,
}) => {
  const [size, setSize] = useState({
    width: type === "preview" ? 600 : type === "settings" ? 600 : 520,
    height: type === "preview" ? 450 : type === "settings" ? 450 : 420,
  });
  const [isResizing, setIsResizing] = useState(false);

  const startResize = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = size.width;
    const startHeight = size.height;

    const onMouseMove = (moveE: MouseEvent) => {
      const newWidth = Math.max(300, startWidth + (moveE.clientX - startX));
      const newHeight = Math.max(200, startHeight + (moveE.clientY - startY));
      setSize({ width: newWidth, height: newHeight });
    };

    const onMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return (
    <motion.div
      initial={{ scale: 0.94, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.94, opacity: 0 }}
      drag={!isResizing}
      dragMomentum={false}
      onMouseDown={() => onFocus(id)}
      style={{
        zIndex,
        left: initialPos.x,
        top: initialPos.y,
        position: "absolute",
        width: type === "preview" ? "auto" : size.width,
        height: type === "preview" ? "auto" : size.height,
        minWidth: type === "preview" ? 400 : 300,
        minHeight: type === "preview" ? 300 : 200,
      }}
      className="bg-[#dfdfdf] shadow-[0_30px_70px_rgba(0,0,0,0.5)] border border-[#777] rounded-t-xl flex flex-col pointer-events-auto overflow-hidden"
    >
      {/* 2000s Aqua Title Bar - Brushed Metal style */}
      <div className="h-8 flex items-center px-3 gap-2 bg-gradient-to-b from-[#f6f6f6] via-[#d1d1d1] to-[#a5a5a5] rounded-t-xl border-b border-[#666] cursor-default relative shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
        <div className="flex gap-1.5 z-10 px-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose(id);
            }}
            className="w-3.5 h-3.5 rounded-full bg-[#ff5f57] border border-[#912d28] shadow-[inset_0_1px_1px_rgba(0,0,0,0.2)] hover:brightness-110 active:brightness-90 flex items-center justify-center group"
          >
            <span className="opacity-0 group-hover:opacity-100 text-[#600] text-[10px] font-black leading-none pb-0.5">
              ×
            </span>
          </button>
          <button className="w-3.5 h-3.5 rounded-full bg-[#febc2e] border border-[#a37c15] shadow-[inset_0_1px_1px_rgba(0,0,0,0.2)]"></button>
          <button className="w-3.5 h-3.5 rounded-full bg-[#28c840] border border-[#1d8a2d] shadow-[inset_0_1px_1px_rgba(0,0,0,0.2)]"></button>
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-[13px] font-bold text-[#333] drop-shadow-[0_1px_0_rgba(255,255,255,0.6)]">
            {title}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto bg-white relative p-6 pointer-events-auto">
        {type === "folder" ? (
          <div className="grid grid-cols-4 gap-6">
            {content.photos.map((photo: Photo, idx: number) => (
              <div
                key={idx}
                className="flex flex-col items-center gap-2 group cursor-pointer"
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  content.onOpenPhoto(photo);
                }}
              >
                <div className="w-24 h-24 bg-white border border-[#ccc] shadow-sm flex items-center justify-center p-1 group-hover:border-[#3855a2] group-hover:shadow-md transition-all">
                  <img
                    src={photo.url}
                    alt={photo.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <span className="text-[11px] text-center font-bold px-1 rounded group-hover:bg-[#3855a2] group-hover:text-white line-clamp-2 leading-tight">
                  {photo.name}
                </span>
              </div>
            ))}
          </div>
        ) : type === "root" ? (
          <div className="grid grid-cols-4 gap-8">
            {content.galleries.map((g: Gallery, idx: number) => (
              <div
                key={idx}
                className="flex flex-col items-center gap-2 group cursor-pointer"
                onDoubleClick={() => content.onOpenFolder(g)}
              >
                <div className="w-16 h-16 relative flex items-center justify-center">
                  <svg
                    style={{ width: "56px", height: "56px" }}
                    className="drop-shadow-md group-hover:brightness-110"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M4 10C4 8.89543 4.89543 8 6 8H18L22 12H42C43.1046 12 44 12.8954 44 14V38C44 39.1046 43.1046 40 42 40H6C4.89543 40 4 39.1046 4 38V10Z"
                      fill="#78B9EB"
                    />
                    <path
                      d="M4 14H44V38C44 39.1046 43.1046 40 42 40H6C4.89543 40 4 39.1046 4 38V14Z"
                      fill="#5899CB"
                    />
                    <path
                      d="M6 14C4.89543 14 4 14.8954 4 16V38C4 39.1046 4.89543 40 6 40H42C43.1046 40 44 39.1046 44 38V16C44 14.8954 43.1046 14 42 14H6Z"
                      fill="#CDE7F7"
                      fillOpacity="0.8"
                    />
                  </svg>
                </div>
                <span className="text-[11px] font-bold text-center px-1 group-hover:bg-[#3855a2] group-hover:text-white rounded uppercase tracking-tighter">
                  {g.title}
                </span>
              </div>
            ))}
          </div>
        ) : type === "settings" ? (
          <div className="flex flex-col gap-8 h-full">
            <div>
              <h4 className="text-[14px] font-black text-[#555] border-b border-[#ccc] pb-1.5 mb-4 uppercase tracking-wider">
                Appearance
              </h4>
              <div className="flex flex-wrap gap-4">
                {[
                  { name: "Classic Blue", color: "#3855a2" },
                  { name: "Graphite", color: "#444444" },
                  { name: "Silver", color: "#b4b4b4" },
                  { name: "Bondi Tea", color: "#008080" },
                  { name: "Deep Purple", color: "#4a2c52" },
                ].map((c) => (
                  <button
                    key={c.color}
                    onClick={() =>
                      content.onSetBg({ type: "color", val: c.color })
                    }
                    className="flex flex-col items-center gap-1 group"
                  >
                    <div
                      className="w-12 h-12 rounded border border-[#999] shadow-inner"
                      style={{ backgroundColor: c.color }}
                    />
                    <span className="text-[9px] font-bold text-[#666] group-hover:text-blue-700">
                      {c.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 min-h-0 flex flex-col">
              <h4 className="text-[14px] font-black text-[#555] border-b border-[#ccc] pb-1.5 mb-4 uppercase tracking-wider">
                Photography Wallpapers
              </h4>
              <div className="grid grid-cols-4 gap-4 overflow-auto pr-2 pb-4 h-full">
                {content.allPhotos.map((p: Photo, idx: number) => (
                  <button
                    key={idx}
                    onClick={() =>
                      content.onSetBg({ type: "image", val: p.url })
                    }
                    className="flex flex-col items-center gap-1 group border border-transparent hover:border-blue-500 p-1"
                  >
                    <img
                      src={p.url}
                      className="w-full h-16 object-cover border border-[#ccc]"
                    />
                    <span className="text-[9px] font-bold text-[#888] line-clamp-1">
                      {p.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : type === "mail" ? (
          <div className="flex h-full bg-white">
            {/* Mail Sidebar */}
            <div className="w-40 border-r border-[#ccc] bg-[#f0f4f9] p-3 flex flex-col gap-4">
              <div>
                <h4 className="text-[10px] font-black text-[#888] uppercase tracking-widest mb-2">
                  Mailboxes
                </h4>
                <div className="flex flex-col gap-1">
                  <div className="bg-[#3855a2] text-white px-2 py-1 rounded text-[11px] font-bold cursor-default">
                    Inbox
                  </div>
                  <div className="px-2 py-1 text-[11px] font-medium text-[#444] hover:bg-[#d0d8e4] rounded cursor-default">
                    Sent
                  </div>
                  <div className="px-2 py-1 text-[11px] font-medium text-[#444] hover:bg-[#d0d8e4] rounded cursor-default">
                    Drafts
                  </div>
                  <div className="px-2 py-1 text-[11px] font-medium text-[#444] hover:bg-[#d0d8e4] rounded cursor-default">
                    Trash
                  </div>
                </div>
              </div>
            </div>
            {/* Mail Content */}
            <div className="flex-1 flex flex-col">
              <div className="p-6 border-b border-[#eee]">
                <h2 className="text-xl font-bold text-[#333] mb-1">
                  Contact for Archive
                </h2>
                <div className="text-[12px] text-[#666] flex flex-col gap-1">
                  <div>
                    From:{" "}
                    <span className="text-black font-bold">Alexander Gu</span>
                  </div>
                  <div>
                    To: <span className="text-black font-bold">Visitor</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 p-8 text-[14px] leading-relaxed text-[#444] font-medium overflow-auto">
                <p className="mb-6">Hello,</p>
                <p className="mb-6">
                  You can reach me at my primary email address for any inquiries
                  regarding the photographic works or the archive itself:
                </p>
                <div className="mb-8">
                  <a
                    href={`mailto:${content.email}`}
                    className="text-lg font-black text-[#3855a2] underline underline-offset-4 hover:text-[#5a9ad8] transition-colors"
                  >
                    {content.email}
                  </a>
                </div>
                <p className="mb-2">Visit my personal website:</p>
                <a
                  href="https://alexgu.art"
                  className="text-lg font-black text-[#3855a2] underline underline-offset-4 hover:text-[#5a9ad8] transition-colors"
                >
                  alexgu.art
                </a>
                <p className="mt-12 text-[11px] text-[#999] italic">
                  Sent from my PowerBook G4
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex bg-[#f0f0f0] min-w-[500px]">
            {/* Left side: Image */}
            <div className="flex-1 p-4 flex items-center justify-center border-r border-[#ccc] bg-[#e0e0e0]">
              <div className="bg-white p-2 shadow-xl border border-[#999]">
                <img
                  src={content.url}
                  alt={content.name}
                  className="max-w-full max-h-[60vh] object-contain"
                />
              </div>
            </div>

            {/* Right side: EXIF Info Panel (Classic OS X Inspector style) */}
            <div className="w-[180px] p-4 flex flex-col gap-4 overflow-auto text-[11px]">
              <div>
                <h4 className="font-black text-[#555] uppercase tracking-wider mb-2 border-b border-[#ccc] pb-1">
                  Info
                </h4>
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between flex-wrap">
                    <span className="text-[#888]">Name:</span>{" "}
                    <span className="font-bold text-right truncate w-full">
                      {content.name}
                    </span>
                  </div>
                  {content.exif?.date && (
                    <div className="flex justify-between">
                      <span className="text-[#888]">Date:</span>{" "}
                      <span className="font-bold">{content.exif.date}</span>
                    </div>
                  )}
                </div>
              </div>

              {content.exif ? (
                <div>
                  <h4 className="font-black text-[#555] uppercase tracking-wider mb-2 border-b border-[#ccc] pb-1">
                    Properties
                  </h4>
                  <div className="flex flex-col gap-2">
                    {Object.entries(content.exif).map(([key, value]) => {
                      if (key.startsWith("_") || value === "?" || !value)
                        return null;
                      return (
                        <div key={key} className="flex flex-col">
                          <span className="text-[#888] text-[9px] uppercase font-bold">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </span>
                          <span
                            className={`font-bold break-words ${key === "Film" ? "text-blue-700" : ""}`}
                          >
                            {typeof value === "number" && key === "ExposureTime"
                              ? value < 1
                                ? `1/${Math.round(1 / value)}`
                                : value
                              : String(value)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-[#999] italic mt-4">
                  No metadata available
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Classic Resize Handle (Bottom Right) */}
      {type !== "preview" && (
        <div
          onMouseDown={startResize}
          className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize z-[100] flex items-end justify-end p-0.5 group"
        >
          <div className="w-3 h-3 border-r-2 border-b-2 border-black/20 group-hover:border-black/40 transition-colors" />
        </div>
      )}
    </motion.div>
  );
};

const MacOSSimulation: React.FC<{ galleries: Gallery[] }> = ({ galleries }) => {
  const [windows, setWindows] = useState<any[]>([]);
  const [time, setTime] = useState(new Date());
  const [maxZ, setMaxZ] = useState(100);
  const [background, setBackground] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("macos-simulation-bg");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse background");
        }
      }
    }
    return { type: "color", val: "#3855a2" };
  });

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const updateBackground = (newBg: any) => {
    setBackground(newBg);
    localStorage.setItem("macos-simulation-bg", JSON.stringify(newBg));
  };

  const onFocus = useCallback((id: string) => {
    setMaxZ((prev) => {
      const newZ = prev + 1;
      setWindows((wins) =>
        wins.map((w) => (w.id === id ? { ...w, zIndex: newZ } : w)),
      );
      return newZ;
    });
  }, []);

  const openFolder = (gallery: Gallery) => {
    const id = `folder-${gallery.slug}`;
    if (windows.find((w) => w.id === id)) {
      onFocus(id);
      return;
    }

    setMaxZ((prev) => {
      const newZ = prev + 1;
      setWindows((wins) => [
        ...wins,
        {
          id,
          title: gallery.title,
          type: "folder",
          content: {
            photos: gallery.photos,
            onOpenPhoto: (p: Photo) => openPhoto(p),
          },
          initialPos: { x: 80 + wins.length * 30, y: 80 + wins.length * 30 },
          zIndex: newZ,
        },
      ]);
      return newZ;
    });
  };

  const openPhoto = (photo: Photo) => {
    const id = `photo-${photo.url}`;
    if (windows.find((w) => w.id === id)) {
      onFocus(id);
      return;
    }

    setMaxZ((prev) => {
      const newZ = prev + 1;
      setWindows((wins) => [
        ...wins,
        {
          id,
          title: photo.name,
          type: "preview",
          content: photo,
          initialPos: { x: 140 + wins.length * 30, y: 100 + wins.length * 30 },
          zIndex: newZ,
        },
      ]);
      return newZ;
    });
  };

  const openFinder = () => {
    const id = "finder-root";
    if (windows.find((w) => w.id === id)) {
      onFocus(id);
      return;
    }

    setMaxZ((prev) => {
      const newZ = prev + 1;
      setWindows((wins) => [
        ...wins,
        {
          id,
          title: "Desktop",
          type: "root", // New type for all folders
          content: {
            galleries,
            onOpenFolder: (g: Gallery) => openFolder(g),
          },
          initialPos: { x: 40, y: 40 },
          zIndex: newZ,
        },
      ]);
      return newZ;
    });
  };

  const openSettings = () => {
    const id = "settings";
    if (windows.find((w) => w.id === id)) {
      onFocus(id);
      return;
    }
    const allPhotos = galleries.flatMap((g) => g.photos);

    setMaxZ((prev) => {
      const newZ = prev + 1;
      setWindows((wins) => [
        ...wins,
        {
          id,
          title: "System Preferences",
          type: "settings",
          content: {
            allPhotos,
            onSetBg: (bg: any) => updateBackground(bg),
          },
          initialPos: { x: 100, y: 100 },
          zIndex: newZ,
        },
      ]);
      return newZ;
    });
  };

  const openMail = () => {
    const id = "mail";
    if (windows.find((w) => w.id === id)) {
      onFocus(id);
      return;
    }
    setMaxZ((prev) => {
      const newZ = prev + 1;
      setWindows((wins) => [
        ...wins,
        {
          id,
          title: "Mail",
          type: "mail",
          content: { email: "gjc78263@gmail.com" },
          initialPos: { x: 120, y: 120 },
          zIndex: newZ,
        },
      ]);
      return newZ;
    });
  };

  const onClose = (id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  };

  return (
    <div
      className="flex-1 relative overflow-hidden flex flex-col transition-all duration-700"
      style={{
        backgroundColor: background.type === "color" ? background.val : "black",
        backgroundImage:
          background.type === "image" ? `url(${background.val})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* 1. Menu Bar - Classic Aqua Gloss */}
      <div className="h-7 bg-gradient-to-b from-[#fdfdfd] via-[#dcdcdc] to-[#bbbbbb] border-b border-[#777] flex items-center justify-between px-3 fixed top-0 left-0 right-0 z-[10000] shadow-sm pointer-events-auto">
        <div className="flex items-center gap-3 text-[12px] font-bold text-black pl-1">
          <span className="px-2 hover:bg-[#3855a2] hover:text-white rounded transition-colors cursor-default">
            Finder
          </span>
          <span
            className="px-2 hover:bg-[#3855a2] hover:text-white rounded transition-colors cursor-default font-medium opacity-60"
            onClick={openSettings}
          >
            Preferences
          </span>
        </div>
        <div className="flex items-center gap-4 text-[12px] font-bold text-black">
          <span className="drop-shadow-[0_1px_0_rgba(255,255,255,0.8)]">
            {time.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}
          </span>
        </div>
      </div>

      {/* 2. Desktop Workspace */}
      <div className="flex-1 relative mt-7 pointer-events-none overflow-hidden">
        {/* Desktop Icons - Right-to-Left Wrapping Grid */}
        <div className="absolute inset-0 right-6 top-6 bottom-6 flex flex-col flex-wrap-reverse content-start gap-x-4 gap-y-8 items-end pointer-events-auto">
          {galleries.map((gallery, idx) => (
            <div
              key={idx}
              className="w-24 group cursor-pointer flex flex-col items-center gap-1"
              onDoubleClick={() => openFolder(gallery)}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <div className="w-10 h-10 relative flex items-center justify-center">
                <svg
                  style={{ width: "40px", height: "40px" }}
                  className="drop-shadow-md group-active:brightness-90 transition-all"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M4 10C4 8.89543 4.89543 8 6 8H18L22 12H42C43.1046 12 44 12.8954 44 14V38C44 39.1046 43.1046 40 42 40H6C4.89543 40 4 39.1046 4 38V10Z"
                    fill="#78B9EB"
                  />
                  <path
                    d="M4 14H44V38C44 39.1046 43.1046 40 42 40H6C4.89543 40 4 39.1046 4 38V14Z"
                    fill="#5899CB"
                  />
                  <path
                    d="M6 14C4.89543 14 4 14.8954 4 16V38C4 39.1046 4.89543 40 6 40H42C43.1046 40 44 39.1046 44 38V16C44 14.8954 43.1046 14 42 14H6Z"
                    fill="#CDE7F7"
                    fillOpacity="0.8"
                  />
                </svg>
              </div>
              <span className="text-[11px] text-white font-bold px-2 py-0.5 rounded shadow-md group-active:bg-[#3855a2] bg-black/40 backdrop-blur-sm text-center leading-tight">
                {gallery.title}
              </span>
            </div>
          ))}
        </div>

        {/* Windows Overlay */}
        <div className="absolute inset-0 z-10">
          <AnimatePresence>
            {windows.map((win) => (
              <MacOSWindow
                key={win.id}
                {...win}
                onClose={onClose}
                onFocus={onFocus}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* 3. Dock - High Fidelity 2000s Aqua Glass Strip */}
      <div className="h-16 flex items-end justify-center pb-2 pointer-events-auto">
        <div
          className="h-12 px-3 flex items-center shadow-[0_15px_35px_rgba(0,0,0,0.4)] relative border-t border-l border-r border-white/60 rounded-xl gap-3"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.6) 100%)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Finder App */}
          <div
            onClick={openFinder}
            style={{ width: "38px", height: "38px" }}
            className="group relative flex items-center justify-center cursor-pointer hover:scale-125 transition-all duration-300 origin-bottom"
          >
            <div className="w-full h-full bg-gradient-to-tr from-[#3a5ba8] via-[#5a9ad8] to-[#9ad6ff] rounded-lg border border-white/50 shadow-md flex items-center justify-center overflow-hidden">
              <div className="w-full h-full relative flex items-center justify-center">
                <span className="text-2xl drop-shadow-md select-none transform transition-transform group-hover:scale-110">
                  📂
                </span>
                <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent h-1/2 rounded-t-lg" />
              </div>
            </div>
            <div
              className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-b-[6px] border-l-transparent border-r-transparent border-b-black/90 transition-opacity duration-300 ${windows.find((w) => w.id === "finder-root") ? "opacity-100" : "opacity-0"}`}
            />
          </div>

          {/* Settings App */}
          <div
            onClick={openSettings}
            style={{ width: "38px", height: "38px" }}
            className="group relative flex items-center justify-center cursor-pointer hover:scale-125 transition-all duration-300 origin-bottom"
          >
            <div className="w-full h-full bg-gradient-to-tr from-[#999] via-[#ccc] to-[#eee] rounded-lg border border-white/50 shadow-md flex items-center justify-center overflow-hidden">
              <div className="w-full h-full relative flex items-center justify-center">
                <span className="text-2xl drop-shadow-md select-none transform transition-transform group-hover:rotate-45">
                  ⚙️
                </span>
                <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent h-1/2 rounded-t-lg" />
              </div>
            </div>
            <div
              className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-b-[6px] border-l-transparent border-r-transparent border-b-black/90 transition-opacity duration-300 ${windows.find((w) => w.id === "settings") ? "opacity-100" : "opacity-0"}`}
            />
          </div>

          {/* Mail App */}
          <div
            onClick={openMail}
            style={{ width: "38px", height: "38px" }}
            className="group relative flex items-center justify-center cursor-pointer hover:scale-125 transition-all duration-300 origin-bottom"
          >
            <div className="w-full h-full bg-gradient-to-tr from-[#f6f6f6] via-[#fff] to-[#eee] rounded-lg border border-white/50 shadow-md flex items-center justify-center overflow-hidden">
              <div className="w-full h-full relative flex items-center justify-center">
                <span className="text-2xl drop-shadow-md select-none transform transition-transform group-hover:-rotate-12">
                  ✉️
                </span>
                <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent h-1/2 rounded-t-lg" />
              </div>
            </div>
            <div
              className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-b-[6px] border-l-transparent border-r-transparent border-b-black/90 transition-opacity duration-300 ${windows.find((w) => w.id === "mail") ? "opacity-100" : "opacity-0"}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MacOSSimulation;
