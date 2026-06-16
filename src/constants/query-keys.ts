export const mermKeys = {
  all: ["merm"] as const,
  events: {
    all: () => [...mermKeys.all, "events"] as const,
  },
};
