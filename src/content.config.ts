import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Long-form insight article bodies. Listing metadata (title, excerpt, hero image,
// category, read time, related project) continues to live in the CMS `articles`
// data; a file here supplies the full editorial body for that slug. The file name
// (id) must match the article slug in the CMS.
const insights = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/insights" }),
  schema: z.object({
    title: z.string(),
    // Optional overrides; the CMS record is the source of truth for the listing.
    updated: z.coerce.date().optional(),
  }),
});

export const collections = { insights };
