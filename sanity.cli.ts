/**
 * Config for the Sanity CLI (e.g. `npx sanity dataset export production`,
 * `npx sanity cors add`, `npx sanity schema deploy`).
 */
import { defineCliConfig } from "sanity/cli";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export default defineCliConfig({ api: { projectId, dataset } });
