import React from "react";
import PortfolioClient from "@/components/PortfolioClient";
import { getLatestServerSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Page() {
  const { hasSavedContent, content } = await getLatestServerSiteContent();

  return (
    <PortfolioClient
      initialContent={content}
      hasServerSaved={hasSavedContent}
    />
  );
}
