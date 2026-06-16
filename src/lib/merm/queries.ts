import { queryOptions } from "@tanstack/react-query";
import { mermKeys } from "@/constants/query-keys";

/** TanStack query options for MERM endpoints (extend as endpoints are added). */
export const mermQueries = {
  events: {
    all: () =>
      queryOptions({
        queryKey: mermKeys.events.all(),
        queryFn: async () => null,
        enabled: false,
      }),
  },
};
