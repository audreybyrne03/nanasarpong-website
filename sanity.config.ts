"use client";

/**
 * Sanity Studio configuration, mounted at /studio
 * (see app/studio/[[...tool]]/page.tsx).
 *
 * Authentication is handled by Sanity: only members of the Sanity project
 * (managed at sanity.io/manage) can sign in and edit content.
 */
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";

import { apiVersion, dataset, projectId, studioUrl } from "./sanity/env";
import { resolve } from "./sanity/presentation";
import { schemaTypes, singletonTypes } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";

export default defineConfig({
  name: "default",
  title: "Dr. Nana Sarpong — Website",
  basePath: studioUrl,
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
    // Hide singletons from the global “Create new document” menu.
    templates: (templates) => templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
  document: {
    // Singletons can be edited and published, but not duplicated or deleted.
    actions: (actions, { schemaType }) =>
      singletonTypes.has(schemaType)
        ? actions.filter(({ action }) => action && ["publish", "discardChanges", "restore"].includes(action))
        : actions,
  },
  plugins: [
    structureTool({ structure }),
    presentationTool({
      resolve,
      previewUrl: { previewMode: { enable: "/api/draft-mode/enable" } },
    }),
    // GROQ query playground — handy for debugging content.
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
