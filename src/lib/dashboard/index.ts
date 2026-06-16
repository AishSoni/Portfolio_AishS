import type { IDashboardRepository } from "./repository";
import { SupabaseDashboardRepository } from "./supabase.repository";

export function getDashboardRepository(): IDashboardRepository {
  return new SupabaseDashboardRepository();
}

export type { IDashboardRepository } from "./repository";
export type * from "./types";
