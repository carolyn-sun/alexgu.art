import React from "react";

const links = [
  {
    label: "Daily Photos Taken by GFX100S",
    href: "/docs/daily-photos-taken-by-gfx100s/",
  },
  {
    label: "Daily Photos Taken by Film",
    href: "/docs/daily-photos-taken-by-film/",
  },
  { label: "Photo Trip to America", href: "/docs/photo-trip-to-america/" },
  { label: "Fall", href: "/docs/fall/" },
  {
    label: "Photo Trip to Shengshan Island",
    href: "/docs/photo-trip-to-shengshan-island/",
  },
  {
    label: "Hajime Sorayama's 'Light, Reflection, Transparency' Exhibition",
    href: "/docs/hajime-sorayama",
  },
  { label: "Shanghai Auto Museum", href: "/docs/shanghai-auto-museum/" },
];

const GalleryIndex = () => {
  return (
    <p
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "0.5em",
      }}
    >
      {links.map((link, idx) => (
        <React.Fragment key={link.href}>
          <a href={link.href} style={{ whiteSpace: "nowrap" }}>
            {link.label}
          </a>
          {idx < links.length - 1 && <span>|</span>}
        </React.Fragment>
      ))}
    </p>
  );
};

export default GalleryIndex;
