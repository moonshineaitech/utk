import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2, ShieldCheck, RotateCcw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  getAssistantConfig,
  useVerifyAssistantTurnstile,
  useSendAssistantMessage,
  type ApplicationType,
} from "@workspace/api-client-react";

import assistantMark from "@assets/generated_images/utk/assistant-mark-v2.png";

// ---------------------------------------------------------------------------
// Cloudflare Turnstile (lazy-loaded, explicit render)
// ---------------------------------------------------------------------------
const TURNSTILE_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

interface TurnstileRenderOptions {
  sitekey: string;
  callback: (token: string) => void;
  "error-callback"?: () => void;
  "expired-callback"?: () => void;
  theme?: "light" | "dark" | "auto";
  size?: "normal" | "flexible" | "compact";
}

interface TurnstileApi {
  render: (el: HTMLElement, opts: TurnstileRenderOptions) => string;
  reset: (id?: string) => void;
  remove: (id: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let turnstileScriptPromise: Promise<void> | null = null;

function loadTurnstile(): Promise<void> {
  if (typeof window === "undefined")
    return Promise.reject(new Error("no window"));
  if (window.turnstile) return Promise.resolve();
  if (turnstileScriptPromise) return turnstileScriptPromise;
  turnstileScriptPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = TURNSTILE_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => {
      turnstileScriptPromise = null;
      reject(new Error("Failed to load Turnstile"));
    };
    document.head.appendChild(script);
  });
  return turnstileScriptPromise;
}

// ---------------------------------------------------------------------------
// Guided FAQ decision tree (canned — no AI cost)
// ---------------------------------------------------------------------------
interface TreeOption {
  label: string;
  goto?: string;
  apply?: ApplicationType;
}
interface TreeNode {
  answer: string;
  options: TreeOption[];
}

const ROOT_GREETING =
  "Hi! I'm the utk.ai assistant. I can guide you to the right program or answer questions about working with us. What brings you here?";

const TREE: Record<string, TreeNode> = {
  root: {
    answer: ROOT_GREETING,
    options: [
      { label: "I'm a student seeking an internship", goto: "internship" },
      { label: "I want utk.ai to build my business", goto: "studio" },
      { label: "I want 1:1 AI coaching", goto: "coaching" },
      { label: "What is utk.ai?", goto: "about" },
      { label: "How do I apply?", goto: "apply" },
    ],
  },
  about: {
    answer:
      "utk.ai (Unsloppable Tech Kickstarter AI) is an elite AI venture studio and talent accelerator. Everything we do is paid and premium. We run three programs: AI training internships you invest in (about $4,000/month), done-for-you company building ($5,000–$25,000+), and elite 1:1 coaching from the founder of GoldRock AI ($1,500/hour).",
    options: [
      { label: "Tell me about internships", goto: "internship" },
      { label: "Build my business", goto: "studio" },
      { label: "1:1 coaching", goto: "coaching" },
    ],
  },
  internship: {
    answer:
      "Our internships are a premium accelerator you invest in (about $4,000/month) — you train inside live, revenue-generating AI teams, ship real AI products, and walk away with elite skills, a portfolio-grade product, and a résumé that opens doors. It's not a job — you pay to train here, and the experience is worth far more than the price. The team shares specifics like timing directly with you after you apply.",
    options: [
      { label: "Who is it for?", goto: "internship_who" },
      { label: "Apply for an internship", apply: "internship" },
      { label: "Ask something else", goto: "root" },
    ],
  },
  internship_who: {
    answer:
      "It's for driven students who want to build at a high level — strong work ethic and genuine curiosity matter more than a perfect résumé. If you love shipping, you'll fit right in.",
    options: [
      { label: "Apply for an internship", apply: "internship" },
      { label: "Back to start", goto: "root" },
    ],
  },
  studio: {
    answer:
      "Our done-for-you studio designs and builds a real AI business for you — we build it, we coach you, and you own and grow it. Bring your idea (or your goals) and our team takes it from there.",
    options: [
      { label: "What do I get?", goto: "studio_what" },
      { label: "Start building", apply: "studio" },
      { label: "Ask something else", goto: "root" },
    ],
  },
  studio_what: {
    answer:
      "You get a real, working AI business built by our studio, plus coaching so you can run and grow it confidently — you own the result. Scope and details are tailored to you and discussed once you apply.",
    options: [
      { label: "Start building", apply: "studio" },
      { label: "Back to start", goto: "root" },
    ],
  },
  coaching: {
    answer:
      "Get elite 1:1 AI coaching directly from the founder of GoldRock AI — personalized, high-signal guidance to help you level up fast and build with real momentum.",
    options: [
      { label: "What's covered?", goto: "coaching_what" },
      { label: "Book coaching", apply: "coaching" },
      { label: "Ask something else", goto: "root" },
    ],
  },
  coaching_what: {
    answer:
      "Coaching is tailored to your goals — strategy, building, and the practical AI skills you need next. The specifics are shaped around you and covered directly with the team after you apply.",
    options: [
      { label: "Book coaching", apply: "coaching" },
      { label: "Back to start", goto: "root" },
    ],
  },
  apply: {
    answer:
      "Easy — tap an Apply button here or anywhere on the page. You'll sign in and send a short request straight to our studio team, who review every one personally and reach out to you.",
    options: [
      { label: "Apply for an internship", apply: "internship" },
      { label: "Build my business", apply: "studio" },
      { label: "Book 1:1 coaching", apply: "coaching" },
    ],
  },
};

// ---------------------------------------------------------------------------
interface ChatMsg {
  id: string;
  role: "user" | "assistant";
  content: string;
}

function uid(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}

function greetingMessages(): ChatMsg[] {
  return [{ id: uid(), role: "assistant", content: ROOT_GREETING }];
}

export function AssistantWidget({
  onApply,
}: {
  onApply: (type: ApplicationType) => void;
}) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>(greetingMessages);
  const [nodeId, setNodeId] = useState<string>("root");
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [gateOpen, setGateOpen] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [gateError, setGateError] = useState<string | null>(null);

  const messagesRef = useRef<ChatMsg[]>(messages);
  const passRef = useRef<{ pass: string; exp: number } | null>(null);
  const resumeAfterGateRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fabRef = useRef<HTMLButtonElement>(null);
  const turnstileBoxRef = useRef<HTMLDivElement>(null);

  const verifyMut = useVerifyAssistantTurnstile();
  const sendMut = useSendAssistantMessage();

  const configQuery = useQuery({
    queryKey: ["assistant", "config"],
    queryFn: () => getAssistantConfig(),
    enabled: open,
    staleTime: Infinity,
  });
  const siteKey = configQuery.data?.turnstileSiteKey ?? "";
  const aiEnabled = siteKey.length > 0;

  const node = TREE[nodeId] ?? TREE.root!;

  function commit(next: ChatMsg[]) {
    messagesRef.current = next;
    setMessages(next);
  }
  function pushUser(content: string) {
    commit([...messagesRef.current, { id: uid(), role: "user", content }]);
  }
  function pushAssistant(content: string) {
    commit([...messagesRef.current, { id: uid(), role: "assistant", content }]);
  }

  function passValid(): boolean {
    const p = passRef.current;
    return !!p && p.exp - 5000 > Date.now();
  }

  // Auto-scroll to the latest message.
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, typing, gateOpen, open]);

  // Focus management on open.
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 220);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [open]);

  // Render the Turnstile widget when the gate is shown.
  useEffect(() => {
    if (!gateOpen || !aiEnabled) return;
    let cancelled = false;
    let widgetId: string | undefined;
    loadTurnstile()
      .then(() => {
        if (cancelled || !turnstileBoxRef.current || !window.turnstile) return;
        turnstileBoxRef.current.innerHTML = "";
        widgetId = window.turnstile.render(turnstileBoxRef.current, {
          sitekey: siteKey,
          theme: "light",
          size: "flexible",
          callback: (token: string) => {
            void handleVerify(token);
          },
          "error-callback": () =>
            setGateError("Verification failed. Please try again."),
          "expired-callback": () =>
            setGateError("The check expired. Please try again."),
        });
      })
      .catch(() =>
        setGateError("Couldn't load the human check. Please try again."),
      );
    return () => {
      cancelled = true;
      if (widgetId && window.turnstile) {
        try {
          window.turnstile.remove(widgetId);
        } catch {
          /* noop */
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gateOpen, aiEnabled, siteKey]);

  async function handleVerify(token: string) {
    setVerifying(true);
    setGateError(null);
    try {
      const res = await verifyMut.mutateAsync({ data: { token } });
      passRef.current = { pass: res.pass, exp: Date.parse(res.expiresAt) };
      setGateOpen(false);
      if (resumeAfterGateRef.current) {
        resumeAfterGateRef.current = false;
        await runAI();
      }
    } catch {
      setGateError("Verification failed. Please try again.");
      try {
        window.turnstile?.reset();
      } catch {
        /* noop */
      }
    } finally {
      setVerifying(false);
    }
  }

  async function runAI() {
    const pass = passRef.current?.pass;
    if (!pass) {
      resumeAfterGateRef.current = true;
      setGateOpen(true);
      return;
    }
    setTyping(true);
    try {
      const history = messagesRef.current
        .filter((m) => m.content.trim().length > 0)
        .slice(-12)
        .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));
      const res = await sendMut.mutateAsync({ data: { pass, messages: history } });
      pushAssistant(res.reply);
    } catch (err) {
      const status = (err as { status?: number })?.status;
      if (status === 401) {
        passRef.current = null;
        resumeAfterGateRef.current = true;
        setGateOpen(true);
      } else if (status === 429) {
        pushAssistant(
          "You've reached the message limit for now. Please try again later, or tap Apply and our team will help you directly.",
        );
      } else {
        pushAssistant(
          "Sorry — I'm having trouble responding right now. Please try again in a moment, or use the quick options above.",
        );
      }
    } finally {
      setTyping(false);
    }
  }

  function submitInput(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || typing || verifying) return;
    setInput("");
    if (!aiEnabled) {
      pushUser(text);
      pushAssistant(
        "Live chat isn't available right now — but the quick options above can help, or tap Apply and our team will reach out to you.",
      );
      return;
    }
    pushUser(text);
    if (passValid()) {
      void runAI();
    } else {
      resumeAfterGateRef.current = true;
      setGateError(null);
      setGateOpen(true);
    }
  }

  function chooseOption(opt: TreeOption) {
    pushUser(opt.label);
    if (opt.apply) {
      pushAssistant("Great choice — opening the application form for you now.");
      onApply(opt.apply);
      setOpen(false);
      return;
    }
    if (opt.goto && TREE[opt.goto]) {
      setNodeId(opt.goto);
      pushAssistant(TREE[opt.goto]!.answer);
    }
  }

  function resetChat() {
    commit(greetingMessages());
    setNodeId("root");
    setGateOpen(false);
    setGateError(null);
    resumeAfterGateRef.current = false;
  }

  function handleClose() {
    setOpen(false);
    fabRef.current?.focus();
  }

  return (
    <>
      {/* Floating action button */}
      <motion.button
        ref={fabRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close the utk.ai assistant" : "Open the utk.ai assistant"}
        aria-expanded={open}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="group fixed bottom-5 right-5 z-40 grid h-16 w-16 place-items-center rounded-full md:bottom-6 md:right-6"
      >
        <span
          aria-hidden
          className="absolute inset-0 rounded-full bg-gradient-flow shadow-[0_14px_40px_-8px_hsl(var(--brand-teal)/0.75)]"
        />
        <span
          aria-hidden
          className="absolute -inset-1.5 rounded-full bg-gradient-flow opacity-30 blur-lg motion-safe:animate-ping motion-reduce:hidden"
        />
        <span className="relative grid h-[3.45rem] w-[3.45rem] place-items-center overflow-hidden rounded-full bg-white/15 backdrop-blur-sm ring-1 ring-white/30">
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <X className="h-6 w-6 text-white" strokeWidth={2.5} />
              </motion.span>
            ) : (
              <motion.img
                key="mark"
                src={assistantMark}
                alt=""
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="h-9 w-9 object-contain drop-shadow"
              />
            )}
          </AnimatePresence>
        </span>
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="utk.ai assistant"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            onKeyDown={(e) => {
              if (e.key === "Escape") handleClose();
            }}
            className="fixed bottom-[5.75rem] right-5 z-40 flex h-[min(72vh,620px)] w-[calc(100vw-2.5rem)] max-w-[400px] flex-col overflow-hidden rounded-3xl border border-border/70 bg-card/95 shadow-[0_30px_80px_-30px_hsl(var(--brand-teal)/0.5)] backdrop-blur-xl md:bottom-24 md:right-6"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-border/60 bg-gradient-flow px-4 py-3 text-white">
              <span className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full bg-white/15 ring-1 ring-white/30">
                <img
                  src={assistantMark}
                  alt=""
                  className="h-6 w-6 object-contain"
                />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-display text-base font-semibold leading-tight">
                  utk.ai Assistant
                </p>
                <p className="truncate text-[0.7rem] text-white/80">
                  Guided help &amp; instant answers
                </p>
              </div>
              <button
                type="button"
                onClick={resetChat}
                aria-label="Start over"
                className="grid h-8 w-8 place-items-center rounded-full text-white/85 transition-colors hover:bg-white/15 hover:text-white"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close assistant"
                className="grid h-8 w-8 place-items-center rounded-full text-white/85 transition-colors hover:bg-white/15 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
            >
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "rounded-br-md bg-gradient-flow text-white shadow-[0_8px_22px_-10px_hsl(var(--brand-teal)/0.7)]"
                        : "rounded-bl-md bg-secondary/70 text-foreground"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {typing && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-secondary/70 px-4 py-3">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-foreground/40 motion-safe:animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Quick replies (decision tree) */}
              {!typing && !gateOpen && node.options.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {node.options.map((opt) => (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => chooseOption(opt)}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all hover:-translate-y-0.5 ${
                        opt.apply
                          ? "bg-gradient-flow text-white shadow-[0_8px_20px_-10px_hsl(var(--brand-teal)/0.8)]"
                          : "border border-primary/30 bg-primary/5 text-primary hover:bg-primary/10"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Turnstile gate */}
            {gateOpen && aiEnabled && (
              <div className="border-t border-border/60 bg-secondary/30 px-4 py-3">
                <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  Quick human check to chat with AI
                </p>
                <div ref={turnstileBoxRef} className="min-h-[65px]" />
                {verifying && (
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Verifying…
                  </p>
                )}
                {gateError && (
                  <p className="mt-1 text-xs text-destructive">{gateError}</p>
                )}
              </div>
            )}

            {/* Composer */}
            <form
              onSubmit={submitInput}
              className="flex items-center gap-2 border-t border-border/60 bg-background/60 px-3 py-3"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={2000}
                disabled={!aiEnabled && configQuery.isFetched}
                placeholder={
                  aiEnabled || !configQuery.isFetched
                    ? "Ask anything about utk.ai…"
                    : "Live chat unavailable — use options above"
                }
                aria-label="Ask the assistant a question"
                className="min-w-0 flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!input.trim() || typing || verifying}
                aria-label="Send message"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-flow text-white shadow-[0_8px_20px_-10px_hsl(var(--brand-teal)/0.8)] transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {typing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
