"use client";

import React, { useEffect } from "react";
import QueryFailedState from "@/components/search/QueryFailedState";
import WorkstationShell from "@/components/layout/WorkstationShell";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Search session runtime error:", error);
  }, [error]);

  return (
    <WorkstationShell>
      <div className="flex-1 flex items-center justify-center p-6">
        <QueryFailedState
          error={error}
          reset={reset}
          message="Failed to retrieve or process search execution data from Materials Project backend services."
        />
      </div>
    </WorkstationShell>
  );
}
