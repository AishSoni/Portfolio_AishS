export interface PipelineRow {
  status: string;
  count: number;
  /** Earliest expiry among apps in this status bucket. */
  earliestExpiry: string | null;
}

export interface FunnelStats {
  applied: number;
  emailed: number;
  viewed: number;
  responded: number;
}

export interface ResumeLeaderboardRow {
  resumeId: string;
  label: string;
  linksIssued: number;
  views: number;
  uniqueRecruiters: number;
}

export interface EngagementFeedItem {
  eventId: number;
  appId: string;
  occurredAt: string;
  company: string;
  contactName: string | null;
  resumeLabel: string | null;
}

export interface TodayBump {
  followupId: number;
  appId: string;
  company: string;
  role: string;
  stepNumber: number;
}

export interface TodayAppItem {
  appId: string;
  company: string;
  role: string;
}

export interface TodayQueue {
  bumps: TodayBump[];
  reactivations: TodayAppItem[];
  staleItems: TodayAppItem[];
  targetProgress: { applied: number; target: number };
  deferredCount: number;
}

export interface ApplicationSummary {
  appId: string;
  companyName: string;
  role: string | null;
  status: string;
  expiresAt: string | null;
  respondedAt: string | null;
  createdAt: string;
}

export interface ApplicationContact {
  id: number;
  email: string;
  name: string | null;
  title: string | null;
}

export interface TrackedLinkRow {
  resumeId: string;
  resumeLabel: string;
  linkToken: string | null;
  contactEmail: string | null;
}

export interface FollowupStep {
  stepNumber: number;
  state: string;
  scheduledFor: string | null;
  templateRef: string | null;
}

export interface ApplicationEvent {
  id: number;
  type: string;
  occurredAt: string;
  contactName: string | null;
  viewerClass: string | null;
}

export interface ApplicationDetail {
  app: ApplicationSummary;
  contacts: ApplicationContact[];
  links: TrackedLinkRow[];
  followups: FollowupStep[];
  events: ApplicationEvent[];
  hasMoreEvents: boolean;
}

export interface EngagementFeedPage {
  items: EngagementFeedItem[];
  hasMore: boolean;
}
