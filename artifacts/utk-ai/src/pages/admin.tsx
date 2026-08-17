import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { useClerk } from "@clerk/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  getMe,
  listApplications,
  listApplicationNotes,
  listContactMessages,
  listUsers,
  useUpdateApplicationStatus,
  useUpdateContactMessageStatus,
  useCreateApplicationNote,
  useUpdateUserRole,
  type Application,
  type ApplicationStatus,
  type ApplicationDealType,
  type ContactMessage,
  type User,
  type UserRole,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  LogOut,
  ShieldAlert,
  Users,
  Mail,
  Building2,
  Filter,
  StickyNote,
  ChevronDown,
  Plus,
  Loader2,
  UserCog,
} from "lucide-react";

const TYPE_LABELS: Record<Application["type"], string> = {
  internship: "Internship",
  studio: "Studio",
  coaching: "Coaching",
};

const STATUSES: ApplicationStatus[] = [
  "new",
  "reviewing",
  "interview",
  "offer",
  "accepted",
  "waitlisted",
  "declined",
];

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  new: "New",
  reviewing: "Reviewing",
  interview: "Interview",
  offer: "Offer",
  accepted: "Accepted",
  declined: "Declined",
  waitlisted: "Waitlisted",
};

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  new: "bg-primary/10 text-primary border-primary/30",
  reviewing: "bg-accent/10 text-accent border-accent/30",
  interview: "bg-sky-500/10 text-sky-600 border-sky-500/30",
  offer: "bg-cyan-500/10 text-cyan-700 border-cyan-500/30",
  accepted: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  declined: "bg-rose-500/10 text-rose-600 border-rose-500/30",
  waitlisted: "bg-slate-400/10 text-slate-600 border-slate-400/30",
};

const DEAL_TYPES: Exclude<ApplicationDealType, null>[] = [
  "retainer",
  "equity",
  "hybrid",
];

const DEAL_LABELS: Record<Exclude<ApplicationDealType, null>, string> = {
  retainer: "Retainer",
  equity: "Equity",
  hybrid: "Hybrid",
};

const ROLES: UserRole[] = ["user", "staff", "admin"];

const ROLE_STYLES: Record<UserRole, string> = {
  user: "bg-slate-400/10 text-slate-600 border-slate-400/30",
  staff: "bg-accent/10 text-accent border-accent/30",
  admin: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
};

const MSG_STATUSES: ContactMessage["status"][] = ["new", "read", "archived"];

const MSG_STATUS_STYLES: Record<ContactMessage["status"], string> = {
  new: "bg-primary/10 text-primary border-primary/30",
  read: "bg-accent/10 text-accent border-accent/30",
  archived: "bg-muted text-muted-foreground border-border",
};

const fieldClass =
  "h-9 rounded-lg border border-border bg-background px-2.5 text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function NotesPanel({ applicationId }: { applicationId: string }) {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [body, setBody] = useState("");

  const notesQuery = useQuery({
    queryKey: ["application-notes", applicationId],
    queryFn: () => listApplicationNotes(applicationId),
  });

  const createNote = useCreateApplicationNote({
    mutation: {
      onSuccess: () => {
        setBody("");
        qc.invalidateQueries({
          queryKey: ["application-notes", applicationId],
        });
      },
      onError: () =>
        toast({ title: "Could not add note", variant: "destructive" }),
    },
  });

  const notes = notesQuery.data ?? [];

  const submit = () => {
    const trimmed = body.trim();
    if (!trimmed || createNote.isPending) return;
    createNote.mutate({ id: applicationId, data: { body: trimmed } });
  };

  return (
    <div className="mt-5 rounded-xl border border-border/70 bg-secondary/30 p-4">
      <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <StickyNote className="h-3.5 w-3.5" />
        Internal notes
      </div>

      {notesQuery.isLoading ? (
        <p className="text-xs text-muted-foreground">Loading notes…</p>
      ) : notes.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          No notes yet. Add the first one below.
        </p>
      ) : (
        <ul className="space-y-3">
          {notes.map((n) => (
            <li
              key={n.id}
              className="rounded-lg border border-card-border bg-card p-3"
            >
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/85">
                {n.body}
              </p>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 text-[0.65rem] text-muted-foreground/70">
                <span className="font-medium">
                  {n.authorName?.trim() || "Team"}
                </span>
                <time className="font-mono">
                  {new Date(n.createdAt).toLocaleString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </time>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={2}
          maxLength={4000}
          placeholder="Add an internal note…"
          className="flex-1 resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <button
          onClick={submit}
          disabled={!body.trim() || createNote.isPending}
          className="inline-flex h-fit items-center justify-center gap-1.5 self-end rounded-lg bg-gradient-flow px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {createNote.isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Plus className="h-3.5 w-3.5" />
          )}
          Add
        </button>
      </div>
    </div>
  );
}

function ApplicationCard({
  app,
  index,
  onStatus,
  onDealType,
  isUpdating,
}: {
  app: Application;
  index: number;
  onStatus: (id: string, status: ApplicationStatus) => void;
  onDealType: (id: string, dealType: ApplicationDealType) => void;
  isUpdating: boolean;
}) {
  const [showNotes, setShowNotes] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      className="relative overflow-hidden rounded-2xl border border-card-border bg-card p-6 shadow-[0_2px_20px_-14px_rgba(0,0,0,0.1)]"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-primary">
              {TYPE_LABELS[app.type]}
            </span>
            <span
              className={`rounded-full border px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide ${STATUS_STYLES[app.status]}`}
            >
              {STATUS_LABELS[app.status]}
            </span>
            {app.dealType && (
              <span className="rounded-full border border-card-border bg-secondary/60 px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide text-foreground/70">
                {DEAL_LABELS[app.dealType]}
              </span>
            )}
            <time className="font-mono text-xs text-muted-foreground/70">
              {new Date(app.createdAt).toLocaleString(undefined, {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </time>
          </div>
          <h3 className="mt-3 font-display text-lg font-semibold">{app.name}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-muted-foreground">
            <a
              href={`mailto:${app.email}`}
              className="flex items-center gap-1.5 hover:text-accent"
            >
              <Mail className="h-3.5 w-3.5" />
              {app.email}
            </a>
            {app.company && (
              <span className="flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5" />
                {app.company}
              </span>
            )}
            {app.budget && (
              <span className="text-muted-foreground/80">
                Budget: {app.budget}
              </span>
            )}
          </div>
          <p className="mt-3 max-w-2xl whitespace-pre-wrap text-sm leading-relaxed text-foreground/75">
            {app.message}
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-3">
          <div className="flex flex-wrap justify-end gap-2">
            {STATUSES.map((s) => (
              <button
                key={s}
                disabled={app.status === s || isUpdating}
                onClick={() => onStatus(app.id, s)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed ${
                  app.status === s
                    ? `${STATUS_STYLES[s]} cursor-default`
                    : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {STATUS_LABELS[s]}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-muted-foreground">
              Deal
            </label>
            <select
              value={app.dealType ?? ""}
              disabled={isUpdating}
              onChange={(e) =>
                onDealType(
                  app.id,
                  (e.target.value || null) as ApplicationDealType,
                )
              }
              className={fieldClass}
            >
              <option value="">None</option>
              {DEAL_TYPES.map((d) => (
                <option key={d} value={d}>
                  {DEAL_LABELS[d]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <button
        onClick={() => setShowNotes((v) => !v)}
        className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <StickyNote className="h-3.5 w-3.5" />
        {showNotes ? "Hide notes" : "Notes"}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform ${showNotes ? "rotate-180" : ""}`}
        />
      </button>

      {showNotes && <NotesPanel applicationId={app.id} />}
    </motion.div>
  );
}

function MessagesInbox({
  messages,
  isLoading,
  onUpdate,
  isUpdating,
}: {
  messages: ContactMessage[];
  isLoading: boolean;
  onUpdate: (id: string, status: ContactMessage["status"]) => void;
  isUpdating: boolean;
}) {
  if (isLoading) {
    return (
      <div className="mt-10 grid gap-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-2xl border border-card-border bg-card"
          />
        ))}
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="mt-10 rounded-3xl border border-dashed border-border bg-card/50 py-20 text-center text-muted-foreground">
        No messages yet.
      </div>
    );
  }

  return (
    <div className="mt-10 grid gap-4">
      {messages.map((m, i) => (
        <motion.div
          key={m.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.04 }}
          className={`relative overflow-hidden rounded-2xl border bg-card p-6 shadow-[0_2px_20px_-14px_rgba(0,0,0,0.1)] ${
            m.status === "new" ? "border-primary/40" : "border-card-border"
          }`}
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide ${MSG_STATUS_STYLES[m.status]}`}
                >
                  {m.status}
                </span>
                <time className="font-mono text-xs text-muted-foreground/70">
                  {new Date(m.createdAt).toLocaleString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </time>
              </div>
              <h3 className="mt-3 font-display text-lg font-semibold">
                {m.subject?.trim() ? m.subject : "(No subject)"}
              </h3>
              <div className="mt-1 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-muted-foreground">
                <span className="font-medium text-foreground/80">{m.name}</span>
                <a
                  href={`mailto:${m.email}`}
                  className="flex items-center gap-1.5 hover:text-accent"
                >
                  <Mail className="h-3.5 w-3.5" />
                  {m.email}
                </a>
              </div>
              <p className="mt-3 max-w-2xl whitespace-pre-wrap text-sm leading-relaxed text-foreground/75">
                {m.message}
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap gap-2">
              {MSG_STATUSES.map((s) => (
                <button
                  key={s}
                  disabled={m.status === s || isUpdating}
                  onClick={() => onUpdate(m.id, s)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium capitalize transition-colors disabled:cursor-not-allowed ${
                    m.status === s
                      ? `${MSG_STATUS_STYLES[s]} cursor-default`
                      : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function UsersPanel({ currentUserId }: { currentUserId?: string }) {
  const qc = useQueryClient();
  const { toast } = useToast();

  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: () => listUsers(),
  });

  const updateRole = useUpdateUserRole({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["users"] });
        toast({ title: "Role updated" });
      },
      onError: () =>
        toast({
          title: "Could not update role",
          description: "You can't remove the last admin.",
          variant: "destructive",
        }),
    },
  });

  const users = usersQuery.data ?? [];

  if (usersQuery.isLoading) {
    return (
      <div className="mt-10 grid gap-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-2xl border border-card-border bg-card"
          />
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="mt-10 rounded-3xl border border-dashed border-border bg-card/50 py-20 text-center text-muted-foreground">
        No users yet.
      </div>
    );
  }

  return (
    <div className="mt-10 grid gap-4">
      {users.map((u: User, i) => {
        const name =
          [u.firstName, u.lastName].filter(Boolean).join(" ").trim() ||
          "Unnamed user";
        const isSelf = u.id === currentUserId;
        return (
          <motion.div
            key={u.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.04 }}
            className="relative flex flex-wrap items-center justify-between gap-4 overflow-hidden rounded-2xl border border-card-border bg-card p-5 shadow-[0_2px_20px_-14px_rgba(0,0,0,0.1)]"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="font-display text-base font-semibold">{name}</h3>
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide ${ROLE_STYLES[u.role]}`}
                >
                  {u.role}
                </span>
                {isSelf && (
                  <span className="text-xs text-muted-foreground/70">(you)</span>
                )}
              </div>
              {u.email && (
                <a
                  href={`mailto:${u.email}`}
                  className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent"
                >
                  <Mail className="h-3.5 w-3.5" />
                  {u.email}
                </a>
              )}
            </div>

            <div className="flex shrink-0 flex-wrap gap-2">
              {ROLES.map((r) => (
                <button
                  key={r}
                  disabled={u.role === r || updateRole.isPending}
                  onClick={() =>
                    updateRole.mutate({ id: u.id, data: { role: r } })
                  }
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium capitalize transition-colors disabled:cursor-not-allowed ${
                    u.role === r
                      ? `${ROLE_STYLES[r]} cursor-default`
                      : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default function Admin() {
  const { signOut } = useClerk();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [filter, setFilter] = useState<"all" | ApplicationStatus>("all");
  const [view, setView] = useState<"requests" | "messages" | "users">(
    "requests",
  );

  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);

  const meQuery = useQuery({ queryKey: ["me"], queryFn: () => getMe() });
  const role = meQuery.data?.role;
  const isAdmin = role === "admin";
  const isStaff = isAdmin || role === "staff";

  const appsQuery = useQuery({
    queryKey: ["applications", "all"],
    queryFn: () => listApplications(),
    enabled: isStaff,
  });

  const messagesQuery = useQuery({
    queryKey: ["contact-messages"],
    queryFn: () => listContactMessages(),
    enabled: isStaff,
  });

  const updateStatus = useUpdateApplicationStatus({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["applications", "all"] });
        toast({ title: "Request updated" });
      },
      onError: () => {
        toast({ title: "Could not update request", variant: "destructive" });
      },
    },
  });

  const updateMessageStatus = useUpdateContactMessageStatus({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["contact-messages"] });
        toast({ title: "Message updated" });
      },
      onError: () => {
        toast({ title: "Could not update message", variant: "destructive" });
      },
    },
  });

  const apps = appsQuery.data ?? [];
  const filtered = useMemo(
    () => (filter === "all" ? apps : apps.filter((a) => a.status === filter)),
    [apps, filter],
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = { total: apps.length };
    for (const s of STATUSES) c[s] = 0;
    for (const a of apps) c[a.status] = (c[a.status] ?? 0) + 1;
    return c;
  }, [apps]);

  const messages = messagesQuery.data ?? [];
  const newMessageCount = messages.filter((m) => m.status === "new").length;

  if (meQuery.isLoading) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
      </div>
    );
  }

  if (!isStaff) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-6 text-center">
        <ShieldAlert className="mb-4 h-12 w-12 text-rose-500" />
        <h1 className="font-display text-2xl font-semibold">Staff only</h1>
        <p className="mt-2 max-w-sm text-muted-foreground">
          Your account doesn't have access to the team dashboard.
        </p>
        <Link href="/portal">
          <Button className="mt-6 rounded-full bg-gradient-flow font-semibold text-white hover:opacity-90">
            Go to your portal
          </Button>
        </Link>
      </div>
    );
  }

  const tabs = [
    ["requests", "Requests", counts.total] as const,
    ["messages", "Messages", newMessageCount] as const,
    ...(isAdmin ? [["users", "Users", 0] as const] : []),
  ];

  const heading =
    view === "requests"
      ? "Incoming Requests"
      : view === "messages"
        ? "Contact Messages"
        : "Team & Users";

  return (
    <div className="min-h-[100dvh] bg-background font-sans text-foreground">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--brand-aqua)/0.08),transparent_55%)]" />

      <header className="glass sticky top-0 z-30 border-b border-border/60">
        <div className="container mx-auto flex h-20 items-center justify-between px-6">
          <Link
            href="/portal"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Portal
          </Link>
          <Button
            variant="ghost"
            onClick={() => signOut({ redirectUrl: basePath || "/" })}
            className="h-10 gap-2 text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </header>

      <main className="container relative z-10 mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-3 py-1 text-xs font-medium uppercase tracking-widest text-accent">
            {view === "users" ? (
              <UserCog className="h-3 w-3" />
            ) : (
              <Users className="h-3 w-3" />
            )}
            {isAdmin ? "Admin Dashboard" : "Staff Dashboard"}
          </div>
          <h1 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
            {heading}
          </h1>
        </motion.div>

        {/* View tabs */}
        <div className="mt-8 inline-flex rounded-full border border-border bg-card p-1">
          {tabs.map(([key, label, badge]) => (
            <button
              key={key}
              onClick={() => setView(key)}
              className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wide transition-colors ${
                view === key
                  ? "bg-gradient-flow text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
              {badge > 0 && (
                <span
                  className={`ml-2 rounded-full px-1.5 py-0.5 text-[0.6rem] ${
                    view === key
                      ? "bg-white/20 text-white"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  {badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {view === "requests" && (
          <>
            <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
              {(
                [
                  ["Total", counts.total],
                  ["New", counts.new],
                  ["Reviewing", counts.reviewing],
                  ["Interview", counts.interview],
                  ["Offer", counts.offer],
                  ["Accepted", counts.accepted],
                  ["Waitlisted", counts.waitlisted],
                  ["Declined", counts.declined],
                ] as const
              ).map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-card-border bg-card p-5 shadow-[0_2px_20px_-14px_rgba(0,0,0,0.1)]"
                >
                  <div className="font-display text-3xl font-semibold text-foreground">
                    {value}
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                    {label}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-2">
              <Filter className="mr-1 h-4 w-4 text-muted-foreground" />
              {(["all", ...STATUSES] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`rounded-full border px-4 py-1.5 text-xs font-medium uppercase tracking-wide transition-colors ${
                    filter === s
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {s === "all" ? "All" : STATUS_LABELS[s]}
                </button>
              ))}
            </div>

            <div className="mt-6 grid gap-4">
              {appsQuery.isLoading ? (
                [0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-36 animate-pulse rounded-2xl border border-card-border bg-card"
                  />
                ))
              ) : filtered.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-border bg-card/50 py-20 text-center text-muted-foreground">
                  No requests in this view.
                </div>
              ) : (
                filtered.map((app, i) => (
                  <ApplicationCard
                    key={app.id}
                    app={app}
                    index={i}
                    isUpdating={updateStatus.isPending}
                    onStatus={(id, status) =>
                      updateStatus.mutate({ id, data: { status } })
                    }
                    onDealType={(id, dealType) =>
                      updateStatus.mutate({ id, data: { dealType } })
                    }
                  />
                ))
              )}
            </div>
          </>
        )}

        {view === "messages" && (
          <MessagesInbox
            messages={messages}
            isLoading={messagesQuery.isLoading}
            onUpdate={(id, status) =>
              updateMessageStatus.mutate({ id, data: { status } })
            }
            isUpdating={updateMessageStatus.isPending}
          />
        )}

        {view === "users" && isAdmin && (
          <UsersPanel currentUserId={meQuery.data?.id} />
        )}
      </main>
    </div>
  );
}
