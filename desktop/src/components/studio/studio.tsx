"use client";

import { StudioLayout } from "@/components/studio/studio-layout";
import { StudioProviders } from "@/components/studio/studio-providers";

export const Studio = () => {
  return (
    <div className="h-full" data-testid="studio">
      <StudioProviders>
        <StudioLayout />
      </StudioProviders>
    </div>
  );
};
