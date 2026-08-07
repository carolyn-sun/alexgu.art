import fs from "node:fs/promises";
import path from "node:path";

export interface GalleryMeta {
  slug: string;
  title: string;
  description?: string;
  coverUrl: string | null;
}

interface MdxDoc {
  frontmatter: {
    title?: string;
    description?: string;
  };
}

export function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// Find first photo for cover.
// Supports both new Markdown syntax ![..](./name) and legacy JSX <Photo json={var} />
export async function getGalleryCover(
  slug: string,
  mdxFileName: string,
): Promise<string | null> {
  let coverUrl: string | null = null;
  try {
    const absMdxPath = path.join(process.cwd(), "docs", slug, mdxFileName);
    const content = await fs.readFile(absMdxPath, "utf-8");

    // Primary: Markdown image syntax ![alt](./basename)
    const mdImageMatch = content.match(/!\[[^\]]*\]\(\.\/?([^)\s]+)/);
    if (mdImageMatch) {
      const baseName = mdImageMatch[1].replace(
        /\.(jpe?g|png|webp|gif|tiff?|heic)$/i,
        "",
      );
      coverUrl = `/docs/${slug}/${baseName}_lq.jpeg`;
    }

    // Fallback: legacy JSX <Photo json={var} />
    if (!coverUrl) {
      const photoMatch = content.match(/<Photo.*?json={(\w+)}/);
      if (photoMatch) {
        const varName = photoMatch[1];
        const importRegex = new RegExp(
          `import\\s+${varName}\\s+from\\s+["'](.*?\\.json)["']`,
        );
        const importMatch = content.match(importRegex);
        if (importMatch) {
          const jsonFileName = importMatch[1];
          const baseName = path.basename(jsonFileName, ".json");
          coverUrl = `/docs/${slug}/${baseName}_lq.jpeg`;
        }
      }
    }

    // Final fallback: first json file in folder
    if (!coverUrl) {
      const files = await fs.readdir(path.join(process.cwd(), "docs", slug));
      const firstJson = files
        .sort()
        .find((f) => f.endsWith(".json") && f !== "package.json");
      if (firstJson) {
        const baseName = path.basename(firstJson, ".json");
        coverUrl = `/docs/${slug}/${baseName}_lq.jpeg`;
      }
    }
  } catch (_e) {}
  return coverUrl;
}

// Glob order is preserved so the home grid keeps its current visible order.
export async function getGalleries(): Promise<GalleryMeta[]> {
  const allDocs = import.meta.glob("../../docs/**/index.{md,mdx}", {
    eager: true,
  }) as Record<string, MdxDoc>;

  return Promise.all(
    Object.entries(allDocs).map(async ([mdxKey, doc]) => {
      const slug = mdxKey.split("/").slice(-2, -1)[0];
      const title = doc.frontmatter.title || slugToTitle(slug);
      const description = doc.frontmatter.description;
      const coverUrl = await getGalleryCover(
        slug,
        mdxKey.endsWith(".md") ? "index.md" : "index.mdx",
      );
      return { slug, title, description, coverUrl };
    }),
  );
}

// Deterministic pick for the site-wide default og:image: first cover in slug
// order, independent of glob order.
export function pickDefaultOgImage(galleries: GalleryMeta[]): string | null {
  const sorted = [...galleries].sort((a, b) => a.slug.localeCompare(b.slug));
  return sorted.map((g) => g.coverUrl).find(Boolean) ?? null;
}
