import { getSupabase } from "@/utils/supabase";
import type { IDashboardRepository } from "./repository";
import type {
  ApplicationDetail,
  EngagementFeedPage,
  FunnelStats,
  PipelineRow,
  ResumeLeaderboardRow,
  TodayQueue,
} from "./types";

const FEED_PAGE_SIZE = 50;
const EVENT_PAGE_SIZE = 50;

function startOfUtcDay(d = new Date()): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

function endOfUtcDay(d = new Date()): Date {
  const start = startOfUtcDay(d);
  return new Date(start.getTime() + 86_400_000 - 1);
}

async function readSetting(
  userId: string,
  key: string,
  fallback: number
): Promise<number> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("settings")
    .select("value")
    .eq("userId", userId)
    .eq("key", key)
    .maybeSingle();

  if (error) throw error;
  const raw = data?.value;
  if (typeof raw === "number") return raw;
  if (typeof raw === "string") {
    const n = parseInt(raw, 10);
    return Number.isNaN(n) ? fallback : n;
  }
  return fallback;
}

export class SupabaseDashboardRepository implements IDashboardRepository {
  async getPipeline(userId: string): Promise<PipelineRow[]> {
    const { data, error } = await getSupabase()
      .from("v_pipeline")
      .select("status, count, earliestExpiry")
      .eq("userId", userId)
      .order("status");

    if (error) throw error;
    return (data ?? []).map((r) => ({
      status: r.status,
      count: r.count,
      earliestExpiry: r.earliestExpiry,
    }));
  }

  async getFunnel(userId: string): Promise<FunnelStats> {
    const { data, error } = await getSupabase()
      .from("v_funnel")
      .select("applied, emailed, viewed, responded")
      .eq("userId", userId)
      .maybeSingle();

    if (error) throw error;
    return {
      applied: data?.applied ?? 0,
      emailed: data?.emailed ?? 0,
      viewed: data?.viewed ?? 0,
      responded: data?.responded ?? 0,
    };
  }

  async getResumeLeaderboard(userId: string): Promise<ResumeLeaderboardRow[]> {
    const { data, error } = await getSupabase()
      .from("v_resume_leaderboard")
      .select("resumeId, label, linksIssued, views, uniqueRecruiters")
      .eq("userId", userId)
      .order("views", { ascending: false });

    if (error) throw error;
    return (data ?? []).map((r) => ({
      resumeId: r.resumeId,
      label: r.label,
      linksIssued: r.linksIssued,
      views: r.views,
      uniqueRecruiters: r.uniqueRecruiters,
    }));
  }

  async getEngagementFeed(
    userId: string,
    page: number
  ): Promise<EngagementFeedPage> {
    const from = page * FEED_PAGE_SIZE;
    const to = from + FEED_PAGE_SIZE - 1;

    const { data, error, count } = await getSupabase()
      .from("v_engagement_feed")
      .select(
        "eventId, appId, occurredAt, company, contactName, resumeLabel",
        { count: "exact" }
      )
      .eq("userId", userId)
      .order("occurredAt", { ascending: false })
      .range(from, to);

    if (error) throw error;

    const items = (data ?? []).map((r) => ({
      eventId: r.eventId,
      appId: r.appId,
      occurredAt: r.occurredAt,
      company: r.company,
      contactName: r.contactName,
      resumeLabel: r.resumeLabel,
    }));

    const total = count ?? 0;
    return { items, hasMore: from + items.length < total };
  }

  async getTodayQueue(userId: string): Promise<TodayQueue> {
    const supabase = getSupabase();
    const now = new Date();
    const dayStart = startOfUtcDay(now);
    const endToday = endOfUtcDay(now);

    const staleCheckDays = await readSetting(userId, "staleCheckDays", 21);
    const dailyApplyTarget = await readSetting(userId, "dailyApplyTarget", 8);
    const staleCutoff = new Date(now);
    staleCutoff.setDate(staleCutoff.getDate() - staleCheckDays);

    const [
      bumpsRes,
      reactivationsRes,
      staleRes,
      appliedRes,
      deferredRes,
      targetSetting,
    ] = await Promise.all([
      supabase
        .from("followups")
        .select("id, appId, stepNumber")
        .eq("userId", userId)
        .eq("state", "queued")
        .lte("scheduledFor", endToday.toISOString())
        .order("scheduledFor", { ascending: true }),
      supabase
        .from("applications")
        .select("appId, companyName, role")
        .eq("userId", userId)
        .eq("status", "eligible"),
      supabase
        .from("applications")
        .select("appId, companyName, role")
        .eq("userId", userId)
        .not("status", "in", '("offer","accepted")')
        .lt("statusSetAt", staleCutoff.toISOString()),
      supabase
        .from("applications")
        .select("appId", { count: "exact", head: true })
        .eq("userId", userId)
        .gte("createdAt", dayStart.toISOString()),
      supabase
        .from("followups")
        .select("id", { count: "exact", head: true })
        .eq("userId", userId)
        .eq("state", "queued")
        .gt("scheduledFor", endToday.toISOString()),
      supabase
        .from("settings")
        .select("value")
        .eq("userId", userId)
        .eq("key", "dailyApplyTarget")
        .maybeSingle(),
    ]);

    if (bumpsRes.error) throw bumpsRes.error;
    if (reactivationsRes.error) throw reactivationsRes.error;
    if (staleRes.error) throw staleRes.error;
    if (appliedRes.error) throw appliedRes.error;
    if (deferredRes.error) throw deferredRes.error;

    const bumpRows = bumpsRes.data ?? [];
    const appIds = [...new Set(bumpRows.map((b) => b.appId))];
    let appMap = new Map<string, { company: string; role: string }>();

    if (appIds.length > 0) {
      const { data: apps, error } = await supabase
        .from("applications")
        .select("appId, companyName, role")
        .eq("userId", userId)
        .in("appId", appIds);
      if (error) throw error;
      appMap = new Map(
        (apps ?? []).map((a) => [
          a.appId,
          { company: a.companyName, role: a.role ?? "—" },
        ])
      );
    }

    const target =
      typeof targetSetting.data?.value === "number"
        ? targetSetting.data.value
        : dailyApplyTarget;

    return {
      bumps: bumpRows.map((b) => {
        const app = appMap.get(b.appId);
        return {
          followupId: b.id,
          appId: b.appId,
          company: app?.company ?? "Unknown",
          role: app?.role ?? "—",
          stepNumber: b.stepNumber,
        };
      }),
      reactivations: (reactivationsRes.data ?? []).map((a) => ({
        appId: a.appId,
        company: a.companyName,
        role: a.role ?? "—",
      })),
      staleItems: (staleRes.data ?? []).map((a) => ({
        appId: a.appId,
        company: a.companyName,
        role: a.role ?? "—",
      })),
      targetProgress: {
        applied: appliedRes.count ?? 0,
        target,
      },
      deferredCount: deferredRes.count ?? 0,
    };
  }

  async getApplicationDetail(
    userId: string,
    appId: string,
    eventPage = 0
  ): Promise<ApplicationDetail | null> {
    const supabase = getSupabase();

    const { data: app, error: appErr } = await supabase
      .from("applications")
      .select(
        "appId, companyName, role, status, expiresAt, respondedAt, createdAt"
      )
      .eq("userId", userId)
      .eq("appId", appId)
      .maybeSingle();

    if (appErr) throw appErr;
    if (!app) return null;

    const eventFrom = eventPage * EVENT_PAGE_SIZE;
    const eventTo = eventFrom + EVENT_PAGE_SIZE - 1;

    const [contactsRes, linksRes, followupsRes, eventsRes] = await Promise.all([
      supabase
        .from("contacts")
        .select("id, email, name, title")
        .eq("userId", userId)
        .eq("appId", appId),
      supabase
        .from("tracked_links")
        .select("resumeId, linkToken, contactId")
        .eq("userId", userId)
        .eq("appId", appId),
      supabase
        .from("followups")
        .select("stepNumber, state, scheduledFor, templateRef")
        .eq("userId", userId)
        .eq("appId", appId)
        .order("stepNumber"),
      supabase
        .from("events")
        .select("id, type, occurredAt, contactId, viewerClass", {
          count: "exact",
        })
        .eq("userId", userId)
        .eq("appId", appId)
        .order("occurredAt", { ascending: false })
        .range(eventFrom, eventTo),
    ]);

    if (contactsRes.error) throw contactsRes.error;
    if (linksRes.error) throw linksRes.error;
    if (followupsRes.error) throw followupsRes.error;
    if (eventsRes.error) throw eventsRes.error;

    const resumeIds = [
      ...new Set((linksRes.data ?? []).map((l) => l.resumeId)),
    ];
    let resumeLabels = new Map<string, string>();
    if (resumeIds.length > 0) {
      const { data: resumes, error } = await supabase
        .from("resumes")
        .select("resumeId, label")
        .eq("userId", userId)
        .in("resumeId", resumeIds);
      if (error) throw error;
      resumeLabels = new Map(
        (resumes ?? []).map((r) => [r.resumeId, r.label])
      );
    }

    const contactById = new Map(
      (contactsRes.data ?? []).map((c) => [c.id, c])
    );

    const events = eventsRes.data ?? [];
    const eventTotal = eventsRes.count ?? 0;

    return {
      app: {
        appId: app.appId,
        companyName: app.companyName,
        role: app.role,
        status: app.status,
        expiresAt: app.expiresAt,
        respondedAt: app.respondedAt,
        createdAt: app.createdAt,
      },
      contacts: (contactsRes.data ?? []).map((c) => ({
        id: c.id,
        email: c.email,
        name: c.name,
        title: c.title,
      })),
      links: (linksRes.data ?? []).map((l) => ({
        resumeId: l.resumeId,
        resumeLabel: resumeLabels.get(l.resumeId) ?? l.resumeId,
        linkToken: l.linkToken,
        contactEmail: l.contactId
          ? (contactById.get(l.contactId)?.email ?? null)
          : null,
      })),
      followups: (followupsRes.data ?? []).map((f) => ({
        stepNumber: f.stepNumber,
        state: f.state,
        scheduledFor: f.scheduledFor,
        templateRef: f.templateRef,
      })),
      events: events.map((e) => ({
        id: e.id,
        type: e.type,
        occurredAt: e.occurredAt,
        contactName: e.contactId
          ? (contactById.get(e.contactId)?.name ?? null)
          : null,
        viewerClass: e.viewerClass,
      })),
      hasMoreEvents: eventFrom + events.length < eventTotal,
    };
  }
}
