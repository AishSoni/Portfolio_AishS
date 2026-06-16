"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BorderStyle, ChartMode, ChartVariant, DataThemeProvider, IconProvider, NeutralColor, ScalingSize, Schemes, SolidStyle, SolidType, SurfaceStyle, ThemeProvider, ToastProvider, TransitionStyle } from "@once-ui-system/core";
import { style, dataStyle } from "../resources";
import { iconLibrary } from "../resources/icons";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { staleTime: 60_000, retry: 1 },
    },
  });
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(makeQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
    <ThemeProvider
      brand={style.brand as Schemes}
      accent={style.accent as Schemes}
      neutral={style.neutral as NeutralColor}
      solid={style.solid as SolidType}
      solidStyle={style.solidStyle as SolidStyle}
      border={style.border as BorderStyle}
      surface={style.surface as SurfaceStyle}
      transition={style.transition as TransitionStyle}
      scaling={style.scaling as ScalingSize}
    >
      <DataThemeProvider
        variant={dataStyle.variant as ChartVariant}
        mode={dataStyle.mode as ChartMode}
        height={dataStyle.height}
        axis={{
          stroke: dataStyle.axis.stroke
        }}
        tick={{
          fill: dataStyle.tick.fill,
          fontSize: dataStyle.tick.fontSize,
          line: dataStyle.tick.line
        }}
        >
        <ToastProvider>
          <IconProvider icons={iconLibrary}>
            {children}
          </IconProvider>
        </ToastProvider>
      </DataThemeProvider>
    </ThemeProvider>
    </QueryClientProvider>
  );
}