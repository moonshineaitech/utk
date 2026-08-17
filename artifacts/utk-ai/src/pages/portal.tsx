import { useEffect } from "react";
import { Link } from "wouter";
import { useUser, useClerk } from "@clerk/react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  getMe,
  listMyApplications,
  type Application,
  type ApplicationStatus,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  LogOut,
  ShieldCheck,
  Inbox,
  Sparkles,
  Check,
  XCircle,
  PauseCircle,
} from "lucide-react";

const TYPE_LABELS: Record<Application["type"], string> = {
  internship: "AI Training Internship",
  studio: "Build My Business",
  coaching: "1:1 Coaching",
};

const PIPELINE: ApplicationStatus[] = [
  "new",
  "reviewing",
  "interview",
  "offer",
  "accepted",
];

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  new: "Submitted",
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

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function StatusTracker({ status }: { status: ApplicationStatus }) {
  if (status === "declined" || status === "waitlisted") {
    const isDeclined = status === "declined";
    return (
      <div
        className={`mt-5 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${
          isDeclined
            ? "border-rose-500/30 bg-rose-500/5 text-rose-600"
            : "border-slate-400/30 bg-slate-400/5 text-slate-600"
        }`}
      >
        {isDeclined ? (
          <XCircle className="mt-0.5 h-5 w-5 shrink-0" />
        ) : (
          <PauseCircle className="mt-0.5 h-5 w-5 shrink-0" />
        )}
        <span>
          {isDeclined
            ? "This request wasn't selected to move forward this round. You're welcome to refine and apply again."
            : "You're on the waitlist — we'll reach out the moment a spot opens up."}
        </span>
      </div>
    );
  }

  const currentIndex = PIPELINE.indexOf(status);

  return (
    <div className="relative mt-6">
      <div className="absolute left-[10%] right-[10%] top-4 h-0.5 -translate-y-1/2 bg-border" />
      <div
        className="absolute left-[10%] top-4 h-0.5 -translate-y-1/2 bg-gradient-flow transition-all duration-500"
        style={{
          width: `${(currentIndex / (PIPELINE.length - 1)) * 80}%`,
        }}
      />
      <div className="relative grid grid-cols-5">
        {PIPELINE.map((s, i) => {
          const reached = i <= currentIndex;
          return (
            <div key={s} className="flex flex-col items-center text-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold transition-colors ${
                  reached
                    ? "border-transparent bg-gradient-flow text-white"
                    : "border-border bg-background text-muted-foreground/50"
                }`}
              >
                {i < currentIndex ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span
                className={`mt-2 text-[0.65rem] font-medium uppercase tracking-wide ${
                  reached ? "text-foreground/80" : "text-muted-foreground/50"
                }`}
              >
                {STATUS_LABELS[s]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Portal() {
  const { user } = useUser();
  const { signOut } = useClerk();

  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);

  const meQuery = useQuery({ queryKey: ["me"], queryFn: () => getMe() });
  const appsQuery = useQuery({
    queryKey: ["applications", "mine"],
    queryFn: () => listMyApplications(),
  });

  const isAdmin = meQuery.data?.role === "admin";
  const isStaff = isAdmin || meQuery.data?.role === "staff";
  const apps = appsQuery.data ?? [];

  return (
    <div className="min-h-[100dvh] bg-background font-sans text-foreground">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--brand-aqua)/0.08),transparent_55%)]" />

      <header className="glass sticky top-0 z-30 border-b border-border/60">
        <div className="container mx-auto flex h-20 items-center justify-between px-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to site
          </Link>
          <div className="flex items-center gap-3">
            {isStaff && (
              <Link href="/admin">
                <Button
                  variant="outline"
                  className="h-10 gap-2 border-accent/40 bg-accent/5 text-accent hover:bg-accent/10"
                >
                  <ShieldCheck className="h-4 w-4" />
                  {isAdmin ? "Admin" : "Staff"}
                </Button>
              </Link>
            )}
            <Button
              variant="ghost"
              onClick={() => signOut({ redirectUrl: basePath || "/" })}
              className="h-10 gap-2 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="container relative z-10 mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium uppercase tracking-widest text-primary">
            <Sparkles className="h-3 w-3" />
            Your Command Center
          </div>
          <h1 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
            Welcome{user?.firstName ? `, ${user.firstName}` : ""}.
          </h1>
          <p className="mt-3 max-w-xl text-lg font-light text-muted-foreground">
            Track every request you've submitted to utk.ai and follow it through
            our review pipeline. We review each one personally.
          </p>
        </motion.div>

        <div className="mt-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">Your Requests</h2>
            <Link href="/">
              <Button className="h-10 rounded-full bg-gradient-flow font-semibold text-white hover:opacity-90">
                New Request
              </Button>
            </Link>
          </div>

          {appsQuery.isLoading ? (
            <div className="grid gap-4">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className="h-44 animate-pulse rounded-2xl border border-card-border bg-card"
                />
              ))}
            </div>
          ) : apps.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/50 py-20 text-center">
              <Inbox className="mb-4 h-10 w-10 text-muted-foreground/50" />
              <p className="text-lg font-medium text-foreground/80">
                No requests yet
              </p>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Pick a path on the homepage — internships, studio, or coaching —
                and submit your first request.
              </p>
              <Link href="/">
                <Button className="mt-6 rounded-full bg-gradient-flow font-semibold text-white hover:opacity-90">
                  Explore Programs
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {apps.map((app, i) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="group relative overflow-hidden rounded-2xl border border-card-border bg-card p-6 shadow-[0_2px_20px_-12px_rgba(0,0,0,0.1)] transition-all hover:-translate-y-0.5 hover:border-primary/30"
                >
                  <div className="absolute inset-y-0 left-0 w-1 bg-gradient-flow opacity-70" />
                  <div className="pl-2">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-display text-lg font-semibold">
                            {TYPE_LABELS[app.type]}
                          </h3>
                          <span
                            className={`rounded-full border px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide ${STATUS_STYLES[app.status]}`}
                          >
                            {STATUS_LABELS[app.status]}
                          </span>
                        </div>
                        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                          {app.message}
                        </p>
                        {app.company && (
                          <p className="mt-2 text-xs text-muted-foreground/70">
                            Company: {app.company}
                          </p>
                        )}
                      </div>
                      <time className="shrink-0 font-mono text-xs text-muted-foreground/60">
                        {new Date(app.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </time>
                    </div>

                    <StatusTracker status={app.status} />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
