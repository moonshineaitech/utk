import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { Link } from "wouter";
import {
  motion,
  MotionConfig,
  useScroll,
  useTransform,
  useInView,
} from "framer-motion";
import { Show, useUser } from "@clerk/react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useCreateApplication,
  useCreateContactMessage,
  getListMyApplicationsQueryKey,
  type ApplicationType,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { AssistantWidget } from "@/components/assistant-widget";
import {
  ArrowRight,
  ChevronRight,
  Rocket,
  Terminal,
  Sparkles,
  Lock,
  Crosshair,
  CheckCircle2,
  LayoutDashboard,
  ArrowUpRight,
  Compass,
  DraftingCompass,
  Code2,
  KeyRound,
  AppWindow,
  Bot,
  Workflow,
  Database,
  BrainCircuit,
  TrendingUp,
  Check,
  X,
  HelpCircle,
  Newspaper,
  Award,
  Trophy,
  GraduationCap,
  Building2,
  Star,
  Quote,
  Zap,
  Cpu,
  ShieldCheck,
  PlayCircle,
  Mail,
  Send,
  Loader2,
  Package,
  Handshake,
  type LucideIcon,
} from "lucide-react";
import {
  SiAnthropic,
  SiGooglecloud,
  SiOpenai,
  SiNvidia,
  SiHuggingface,
  SiVercel,
  SiSupabase,
  SiStripe,
} from "react-icons/si";
import { FaAws, FaMicrosoft } from "react-icons/fa6";

import heroVideo from "@/assets/videos/ocean-hero.mp4";
import heroPoster from "@/assets/videos/ocean-hero-poster.jpg";
import businessHeroVideo from "@/assets/videos/business-hero.mp4";
import businessHeroPoster from "@/assets/videos/business-hero-poster.jpg";
import businessBgVideo from "@/assets/videos/business-bg-hero.mp4";
import businessBgPoster from "@/assets/videos/business-bg-hero-poster.jpg";
import explainerVideo from "@/assets/videos/explainer.mp4";
import explainerPoster from "@/assets/videos/explainer-poster.jpg";
import manifestoVideo from "@/assets/videos/manifesto.mp4";
import manifestoPoster from "@/assets/videos/manifesto-poster.jpg";

import lunafoldImg from "@/assets/projects/lunafold_com.png";
import thoughtInstituteImg from "@/assets/projects/thought_institute.png";
import appalachiaImg from "@/assets/projects/appalachia_ai.png";
import becometheautomatorImg from "@/assets/projects/becometheautomator_com.png";
import nashvillehackathonsImg from "@/assets/projects/nashvillehackathons_com.png";
import cubicfishImg from "@/assets/projects/cubic_fish.png";
import eformativeImg from "@/assets/projects/eformative_com.png";
import goldrockhealthImg from "@/assets/projects/goldrockhealth_com.png";
import gulfshoresbookingImg from "@/assets/projects/gulfshoresbooking_com.png";
import nashmapImg from "@/assets/projects/nashmap_com.png";
import vantaspearImg from "@/assets/projects/vantaspear.png";
import advisoryAutomatedImg from "@/assets/projects/advisoryautomated_com.png";
import lunaRubyImg from "@/assets/projects/luna_ruby.png";
import westendwineImg from "@/assets/projects/westendwine_com.png";
import unsloppableImg from "@/assets/projects/unsloppable_io.png";
import sonicmvpImg from "@/assets/projects/sonicmvp_com.png";
import localeventsmapImg from "@/assets/projects/localeventsmap_com.png";
import streamfishImg from "@/assets/projects/streamfish.png";
import lunastackImg from "@/assets/projects/lunastack.png";
import americaQuantumImg from "@/assets/projects/america_quantum.png";
import diamondpeImg from "@/assets/projects/diamondpe_ai.png";
import rubyE2eImg from "@/assets/projects/ruby_e2e.png";
import mshineImg from "@/assets/projects/mshine_safety.png";
import fsaGoldImg from "@/assets/projects/fsa_gold.png";
import glooChatImg from "@/assets/projects/gloo_chat.png";
import promptAssistImg from "@/assets/projects/prompt_assist.png";
import emberblackImg from "@/assets/projects/emberblack.png";

import architectImg from "@/assets/founder/architect.png";
import buildClaudeOfWarImg from "@/assets/founder/builds/claudeofwar.png";
import buildBetterSiriImg from "@/assets/founder/builds/better-siri.png";
import buildRubyImg from "@/assets/founder/builds/ruby.png";
import buildPortfolioImg from "@/assets/founder/builds/portfolio.png";
import founderVideo from "@/assets/videos/founder.mp4";
import founderPoster from "@/assets/videos/founder-poster.jpg";

import buildImg from "@/assets/playbook/build.png";
import trainImg from "@/assets/playbook/train.png";
import coachImg from "@/assets/playbook/coach.png";
import turnkeyImg from "@/assets/playbook/turnkey.png";

import iconRocket from "@assets/generated_images/utk/icon-rocket.png";
import iconKey from "@assets/generated_images/utk/icon-key.png";
import iconCompass from "@assets/generated_images/utk/icon-compass.png";
import iconRuler from "@assets/generated_images/utk/icon-ruler.png";
import iconCube from "@assets/generated_images/utk/icon-cube.png";
import iconCap from "@assets/generated_images/utk/icon-cap.png";
import iconTarget from "@assets/generated_images/utk/icon-target.png";
import iconApp from "@assets/generated_images/utk/icon-app.png";
import iconRobot from "@assets/generated_images/utk/icon-robot.png";
import iconGears from "@assets/generated_images/utk/icon-gears.png";
import iconBrain from "@assets/generated_images/utk/icon-brain.png";
import iconDatabase from "@assets/generated_images/utk/icon-database.png";
import iconGrowth from "@assets/generated_images/utk/icon-growth.png";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

const fadeInUp = {
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
};

const EASE = [0.22, 1, 0.36, 1] as const;

const heroStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11, delayChildren: 0.05 } },
};

const heroItem = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const TYPE_META: Record<ApplicationType, { label: string; blurb: string }> = {
  internship: {
    label: "AI Training Internship",
    blurb: "Get embedded in live, revenue-generating AI teams.",
  },
  studio: {
    label: "Build My Business",
    blurb: "We build your dream company for you — done for you.",
  },
  coaching: {
    label: "1:1 Coaching",
    blurb: "Train directly under the founder of GoldRock AI.",
  },
};

const PLAYBOOK: {
  id: string;
  type?: ApplicationType;
  icon: LucideIcon;
  kicker: string;
  title: string;
  tagline: string;
  price: string;
  desc: string;
  img: string;
  metrics: { value: string; label: string }[];
  features: string[];
  tags: string[];
  cta: string;
}[] = [
  {
    id: "studio",
    type: "studio",
    icon: Rocket,
    kicker: "Venture Studio",
    title: "We Build Your Business",
    tagline: "Done-for-you, revenue-ready, yours to keep.",
    price: "Builds from $5,000 to $25,000+ — scoped to ambition.",
    desc: "The flagship. We design, build, and ship your company on the exact production infrastructure behind GoldRock AI — faster and cheaper than hiring an agency or assembling a team. You own every line.",
    img: buildImg,
    metrics: [
      { value: "10×", label: "Faster to launch" },
      { value: "−70%", label: "vs. agency cost" },
      { value: "55+", label: "Products shipped" },
      { value: "100%", label: "You own it" },
    ],
    features: [
      "Full product, code & infrastructure — done for you",
      "Built on GoldRock AI's battle-tested stack",
      "Launched in weeks, not months",
      "Clean handoff — you run and own it",
    ],
    tags: ["Done-for-you", "Revenue-ready", "Full ownership", "We may invest"],
    cta: "Build My Business",
  },
  {
    id: "turnkey",
    icon: Package,
    kicker: "Off-the-Shelf",
    title: "Buy a Turnkey AI Platform",
    tagline: "Ready-made AI platforms & websites — buy, launch, own.",
    price: "Productized and priced to ship — ask for the current catalog.",
    desc: "Don't want to wait for a custom build? We sell ready-to-go, out-of-the-box AI platforms and websites you can buy outright and launch in days. Proven products built on the same production stack behind our flagships — lightly tailored to your brand, then handed over. You own it outright.",
    img: turnkeyImg,
    metrics: [
      { value: "Days", label: "To launch" },
      { value: "Proven", label: "Off our stack" },
      { value: "100%", label: "You own it" },
      { value: "Yours", label: "To run & grow" },
    ],
    features: [
      "Ready-made AI platforms & websites, off the shelf",
      "Built on our battle-tested production stack",
      "Lightly tailored to your brand, then handed over",
      "Live in days — no long build cycle",
    ],
    tags: ["Off-the-shelf", "Launch in days", "Full ownership"],
    cta: "Browse Turnkey Builds",
  },
  {
    id: "internships",
    type: "internship",
    icon: Terminal,
    kicker: "Talent Accelerator",
    title: "AI Internships & Training",
    tagline: "Learn to build like the top 1% — on real work.",
    price: "$4,000 / month — you invest in the experience (yes, interns pay us).",
    desc: "Hands-on internships that embed you inside live, revenue-generating AI teams. This is a paid program you invest in — you pay to train shoulder-to-shoulder with our operators on real production systems, and you leave with elite skills, a portfolio-grade product you actually shipped, and a résumé that opens doors. Never classroom theory.",
    img: trainImg,
    metrics: [
      { value: "Live", label: "Production teams" },
      { value: "1:1", label: "Operator feedback" },
      { value: "100%", label: "Hands-on" },
      { value: "0", label: "Classroom theory" },
    ],
    features: [
      "Embed in live, revenue-generating AI teams",
      "Cutting-edge, hands-on curriculum",
      "Ship a real, portfolio-grade product",
      "Direct code & architecture feedback",
    ],
    tags: ["Hands-on", "Real teams", "Portfolio-ready"],
    cta: "Apply to Train",
  },
  {
    id: "coaching",
    type: "coaching",
    icon: Crosshair,
    kicker: "Founder Mentorship",
    title: "Elite 1:1 Coaching",
    tagline: "Train directly under a frontier AI operator.",
    price: "$1,500 / hour — direct, senior, and worth every minute.",
    desc: "Work one-on-one with the founder of GoldRock AI — the mind behind 55+ live AI products and 1.2M annual hours of automated work. Architecture reviews, code reviews, and operator-level strategy to break through your bottlenecks fast.",
    img: coachImg,
    metrics: [
      { value: "1:1", label: "Direct access" },
      { value: "55+", label: "Mentor's products" },
      { value: "1.2M", label: "Hrs/yr automated" },
      { value: "100%", label: "Operator-led" },
    ],
    features: [
      "Direct mentorship from GoldRock AI's founder",
      "Architecture & code reviews",
      "Operator-level strategy sessions",
      "Break through bottlenecks fast",
    ],
    tags: ["Founder-led", "Architecture reviews", "Strategy"],
    cta: "Request Mentorship",
  },
];

const FLAGSHIPS: {
  name: string;
  tagline: string;
  value: string;
  highlight: string;
  img: string;
  url: string;
}[] = [
  {
    name: "GoldRockHealth.com",
    tagline: "Healthcare Bill Protector",
    value:
      "Hospitals have teams protecting their revenue — now patients have an AI protecting theirs. It reads your medical bills, flags overcharges, and arms you with dispute templates and negotiation strategy.",
    highlight: "Saves patients $2K–$35K+",
    img: goldrockhealthImg,
    url: "https://GoldRockHealth.com",
  },
  {
    name: "LunaFold.com",
    tagline: "Protein Intelligence Platform",
    value:
      "Visualize any protein and run frontier-model drug-discovery workflows right in the browser — a built-in Mol* 3D viewer and genomics tooling, free, with no credit card.",
    highlight: "200M+ AlphaFold structures",
    img: lunafoldImg,
    url: "https://LunaFold.com",
  },
  {
    name: "eformative.com",
    tagline: "AI Listing Watchdog",
    value:
      "Tell it what you're hunting — an apartment, a car, a vacation rental — and its AI scans 15+ markets around the clock, alerting you the instant a new match goes live.",
    highlight: "Alerts as fast as every 4 hours",
    img: eformativeImg,
    url: "https://eformative.com",
  },
  {
    name: "Appalachia.ai",
    tagline: "AI That Gives Back",
    value:
      "28+ frontier models in one subscription — and every dollar funds broadband, scholarships, and the Imagination Library across Appalachia.",
    highlight: "10% of revenue reinvested",
    img: appalachiaImg,
    url: "https://Appalachia.ai",
  },
  {
    name: "Ruby",
    tagline: "Voice-First AI Assistant",
    value:
      "The Siri that actually works — AI-powered voice shortcuts for iPhone that run real workflows hands-free, powered by frontier models.",
    highlight: "120+ actions · 70+ iOS shortcuts",
    img: lunaRubyImg,
    url: "https://luna.goldrock.ai",
  },
];

type Project = {
  name: string;
  tagline: string;
  desc: string;
  url: string;
  img?: string;
  isRestricted?: boolean;
  comingSoon?: boolean;
};

const projects: Project[] = [
  {
    name: "eformative.com",
    tagline: "AI-Powered Listing Watchdog",
    desc: "Tell it what you're hunting — an apartment, a car, a rental — and its AI watchdog scans 15+ markets around the clock, pinging you the instant a new match goes live.",
    img: eformativeImg,
    url: "https://eformative.com",
  },
  {
    name: "LunaFold.com",
    tagline: "Protein Intelligence Platform",
    desc: "Visualize any protein in seconds and run AI drug-discovery workflows right in your browser — 200M+ AlphaFold structures, a built-in Mol* 3D viewer, and frontier-model analysis.",
    img: lunafoldImg,
    url: "https://LunaFold.com",
  },
  {
    name: "Ruby",
    tagline: "Voice-First AI Assistant",
    desc: "Siri-style shortcuts that actually get things done — 120+ voice actions and smart workflows, powered by Claude. Run your phone hands-free.",
    img: lunaRubyImg,
    url: "https://luna.goldrock.ai",
  },
  {
    name: "Appalachia.ai",
    tagline: "AI That Gives Back",
    desc: "28 frontier models in one subscription — with 10% of every dollar funding broadband, scholarships, and Dolly Parton's Imagination Library across Appalachia.",
    img: appalachiaImg,
    url: "https://Appalachia.ai",
  },
  {
    name: "GoldRockHealth.com",
    tagline: "Healthcare Bill Protector",
    desc: "AI that reads, challenges, and shrinks your medical bills — overcharge detection, dispute templates, and negotiation strategy built in.",
    img: goldrockhealthImg,
    url: "https://GoldRockHealth.com",
  },
  {
    name: "BecomeTheAutomator.com",
    tagline: "Build Your First AI App in 30 Days",
    desc: "A step-by-step system with done-for-you templates to ship profitable AI apps with zero coding — the exact methods behind 435,000+ automated hours.",
    img: becometheautomatorImg,
    url: "https://BecomeTheAutomator.com",
  },
  {
    name: "cubic.fish",
    tagline: "Public-Reaction Simulator",
    desc: "See how the room reacts before you ship the move — 2,500 demographically-stratified agents and 50-run ensembles deliver calibrated reads with confidence ranges.",
    img: cubicfishImg,
    url: "https://cubic.fish",
  },
  {
    name: "thought.institute",
    tagline: "AI as a Force for Good",
    desc: "A policy blueprint for the age of intelligence — democratizing AI so expertise becomes shared infrastructure, broadly distributed and community-owned.",
    img: thoughtInstituteImg,
    url: "https://thought.institute",
  },
  {
    name: "NashvilleHackathons.com",
    tagline: "AI Builders Competition",
    desc: "A premier free AI hackathon at Vanderbilt University — 48 hours to ship a real product, hands-on workshops, and $1,000+ in prizes.",
    img: nashvillehackathonsImg,
    url: "https://NashvilleHackathons.com",
  },
  {
    name: "Nashmap.com",
    tagline: "Live City Guide",
    desc: "One real-time map for a whole city — events, venues, deals, traffic, cameras, and local businesses, all live in one place.",
    img: nashmapImg,
    url: "https://Nashmap.com",
  },
  {
    name: "localeventsmap.com",
    tagline: "Live Local Events Map",
    desc: "A real-time, map-first guide to what's happening around you — concerts, markets, meetups, and pop-ups, all plotted live so you never miss what's nearby.",
    img: localeventsmapImg,
    url: "https://localeventsmap.com",
  },
  {
    name: "GulfShoresBooking.com",
    tagline: "Find Your Place in the Sun",
    desc: "Elevated beachfront rentals, curated local events, and white-sand escapes along the emerald waters of Gulf Shores, Alabama.",
    img: gulfshoresbookingImg,
    url: "https://GulfShoresBooking.com",
  },
  {
    name: "SonicMVP",
    tagline: "AI MVP in 7 Days",
    desc: "Rapid end-to-end AI product development — apps, sites, tools, and whole businesses shipped in 7 days at up to 90% less cost, from P&G and Deloitte alumni.",
    img: sonicmvpImg,
    url: "https://sonicmvp.com",
  },
  {
    name: "Unsloppable",
    tagline: "Signal Over Slop",
    desc: "An AI-native arcade with fresh daily trivia pulled from today's headlines, stacked on six premium worlds — Quiplash, Pitch Panic, Ticker Rider and more.",
    img: unsloppableImg,
    url: "https://unsloppable.io",
  },
  {
    name: "West End Wine",
    tagline: "Boulder Wine & Spirits",
    desc: "A modern storefront for Boulder's premier curated wine, craft spirits, and artisan beer shop on Pearl Street — serving downtown since 1990.",
    img: westendwineImg,
    url: "https://westendwineboulder.com",
  },
  {
    name: "StreamFish",
    tagline: "AI Production Booth",
    desc: "An on-air co-pilot for solo streamers — sub-300ms live captions, a rundown that writes itself, a topic newswire, and real-time coaching across Twitch, YouTube & TikTok.",
    img: streamfishImg,
    url: "https://stream.fish",
  },
  {
    name: "LunaStack",
    tagline: "Compute Orchestration Layer",
    desc: "The modular compute and model-orchestration layer powering the GoldRock venture stack — the infrastructure backbone behind the studio's products.",
    img: lunastackImg,
    url: "https://lunastack.com",
  },
  {
    name: "America Quantum",
    tagline: "Frontier-Tech Newsroom",
    desc: "A premium AI and frontier-tech publication with live coverage, regional editions, and a fast-growing subscriber base tracking the future of American compute.",
    img: americaQuantumImg,
    url: "https://americaquantum.com",
  },
  {
    name: "DiamondPE AI",
    tagline: "Private Equity Automation",
    desc: "AI-driven private-equity analysis and automation — accelerating diligence, modeling, and deal workflows for investment teams.",
    img: diamondpeImg,
    url: "https://vcautomation.engineering",
  },
  {
    name: "Ruby E2E",
    tagline: "Supply-Chain Planning AI",
    desc: "End-to-end AI for supply-chain planning and analytics — demand, inventory, and logistics intelligence in one system.",
    img: rubyE2eImg,
    url: "https://rubyscm.com",
  },
  {
    name: "mShine Safety",
    tagline: "AI Safety & Benchmarking",
    desc: "An AI safety and benchmarking platform — evaluating and stress-testing models so teams can ship with confidence.",
    img: mshineImg,
    url: "https://mshine.ai",
  },
  {
    name: "FSA.gold",
    tagline: "Financial Analytics Platform",
    desc: "A financial-services and analytics platform bringing AI-grade insight to markets, portfolios, and reporting.",
    img: fsaGoldImg,
    url: "https://fsa.gold",
  },
  {
    name: "Gloo Chat",
    tagline: "Conversational AI Platform",
    desc: "An advanced conversational AI platform for natural, helpful dialogue across products and audiences.",
    img: glooChatImg,
    url: "https://gloo-chat1.solideogloria.ai",
  },
  {
    name: "Prompt Assist",
    tagline: "Prompt Engineering Studio",
    desc: "A prompt-engineering platform that helps teams craft, test, and refine the prompts behind production AI features.",
    img: promptAssistImg,
    url: "https://goldrock.dev",
  },
  {
    name: "EmberBlack",
    tagline: "AI Agent Harness",
    desc: "An AI agent harness for orchestrating and running autonomous agents — the studio's framework for putting agents to work. Launching soon.",
    img: emberblackImg,
    url: "https://emberblack.ai",
    comingSoon: true,
  },
  {
    name: "AdvisoryAutomated.com",
    tagline: "AI Academic Advisor",
    desc: "Automates the work of college academic advisors — mapping degree requirements, building course plans, and guiding students to graduation at scale.",
    img: advisoryAutomatedImg,
    url: "https://advisoryautomated.com",
  },
  {
    name: "VantaSpear",
    tagline: "AI Command & Decision System",
    desc: "VantaSpear (aka ClaudeOfWar) — an AI command-and-decision system in the lineage of Palantir's Maven and Warp Speed, turning live data into fast, defensible decisions. US-only by design.",
    img: vantaspearImg,
    url: "https://vantaspear.com",
    isRestricted: true,
  },
];

const METHOD: { img: string; step: string; title: string; desc: string }[] =
  [
    {
      img: iconCompass,
      step: "01",
      title: "Blueprint",
      desc: "We pressure-test the idea, map the market, and define a razor-sharp spec — the exact thing worth building.",
    },
    {
      img: iconRuler,
      step: "02",
      title: "Architect",
      desc: "We design the data model, AI systems, and infrastructure on GoldRock AI's proven stack — built to scale from day one.",
    },
    {
      img: iconCube,
      step: "03",
      title: "Build",
      desc: "Operators — not juniors — write production code fast. You watch your company take shape in weeks, not quarters.",
    },
    {
      img: iconRocket,
      step: "04",
      title: "Launch",
      desc: "We ship to real users with analytics, payments, and growth wired in. Live, revenue-ready, and polished.",
    },
    {
      img: iconKey,
      step: "05",
      title: "Handoff",
      desc: "Clean code, full docs, and the keys to everything. You own 100% — and we make sure you can run it.",
    },
  ];

const CAPABILITIES: { img: string; title: string; desc: string }[] = [
  {
    img: iconApp,
    title: "AI Web & Mobile Apps",
    desc: "Full-stack, production-grade products with frontier models wired into every surface.",
  },
  {
    img: iconRobot,
    title: "Autonomous Agents",
    desc: "Tool-using agents that research, decide, and act across your systems — safely, on rails.",
  },
  {
    img: iconGears,
    title: "Workflow Automation",
    desc: "Replace manual busywork end to end. We've automated 1.2M+ hours of work a year.",
  },
  {
    img: iconBrain,
    title: "Custom Models & RAG",
    desc: "Retrieval, fine-tuning, and evaluation pipelines tuned to your data and your domain.",
  },
  {
    img: iconDatabase,
    title: "Data & ML Platforms",
    desc: "Pipelines, warehouses, and dashboards that turn raw data into a compounding advantage.",
  },
  {
    img: iconGrowth,
    title: "Growth & GTM Systems",
    desc: "Payments, analytics, SEO, and acquisition engineered in from launch — not bolted on.",
  },
];

const SERVICES: {
  icon: LucideIcon;
  title: string;
  desc: string;
  tag: string;
}[] = [
  {
    icon: Crosshair,
    title: "AI Red-Teaming & Security",
    desc: "We stress-test your AI the way real attackers would — prompt injection, jailbreaks, data exfiltration, and model-safety audits — then hand you a prioritized fix list. Led by an operator featured in The Guardian for prompt-injection red-teaming and responsible disclosure.",
    tag: "Universities & businesses",
  },
  {
    icon: Rocket,
    title: "MVP → Production",
    desc: "Got a prototype or a vibe-coded MVP held together with tape? We harden it into a secure, scalable, production-grade product — real auth, tests, observability, and CI/CD.",
    tag: "Founders & teams",
  },
  {
    icon: DraftingCompass,
    title: "AI Audits & Strategy",
    desc: "A clear-eyed assessment of where AI actually moves the needle for your organization — with an honest, build-ready roadmap instead of hype.",
    tag: "Leadership & operators",
  },
  {
    icon: GraduationCap,
    title: "Team Training & Workshops",
    desc: "Hands-on AI upskilling for your team or campus — the exact tools, agents, and workflows we use to ship real products, taught by people who actually ship.",
    tag: "Orgs & campuses",
  },
];

const COMPARE_COLUMNS = ["utk.ai", "Agency", "In-House", "DIY"];
const COMPARE_ROWS: { label: string; values: (boolean | string)[] }[] = [
  { label: "Time to launch", values: ["Weeks", "Months", "Quarters", "Someday"] },
  { label: "Cost vs. agency", values: ["−70%", "Baseline", "Highest", "Your time"] },
  { label: "Frontier AI expertise", values: [true, "Varies", "Hard to hire", false] },
  { label: "Production-grade code", values: [true, "Varies", true, false] },
  { label: "You own 100%", values: [true, false, true, true] },
  { label: "Ongoing risk", values: ["Low", "Lock-in", "Payroll", "On you"] },
];

const OLD_WAY: string[] = [
  "Four years to memorize what AI now does in seconds.",
  "Tens of thousands in debt for a credential employers increasingly skim past.",
  "Taught by people who've never shipped a product or run a company.",
  "\"Someday\": graduate, then job-hunt, then maybe get your shot.",
];

const NEW_WAY: string[] = [
  "Ship real, revenue-ready products in weeks — not semesters.",
  "Master the exact AI tools rewriting every industry right now.",
  "Learn directly from operators running live, profitable companies.",
  "Ship a portfolio-grade product while your peers are still taking notes.",
];

const FOUNDER_PRESS = {
  outlet: "The Guardian",
  kicker: "National press",
  date: "October 2025",
  headline: "A national story on the AI elite — and the builder who broke a pre-release model.",
  context:
    "Not a niche tech blog. The Guardian's national feature on the AI movement remaking Silicon Valley — headlined on former Intel CEO Pat Gelsinger and citing figures like Peter Thiel and Andreessen Horowitz — is the same story that reported Ryan getting a not-yet-released AI model to break via a single prompt injection, then disclosing the flaw straight to the company's president.",
  quote:
    "Ryan Siebert, an AI product developer … was able to get Gloo's newest large language model, which has not yet been publicly launched, to provide [restricted, dangerous output] through a prompt injection. He later communicated with the president of Gloo AI to share details about the vulnerability.",
  attribution: "The Guardian, 28 Oct 2025",
  url: "https://www.theguardian.com/technology/2025/oct/28/patrick-gelsinger-christian-ai-gloo-silicon-valley",
};

const FOUNDER_PRESS_FIGURES: string[] = [
  "Former Intel CEO Pat Gelsinger",
  "Peter Thiel",
  "Andreessen Horowitz",
];

const FOUNDER_BUILDS: { name: string; desc: string; tag: string; img: string }[] =
  [
    {
      name: "ClaudeOfWar",
      tag: "Decision Systems",
      desc: "An AI command-and-decision system recreating Palantir's Maven / Warp Speed.",
      img: buildClaudeOfWarImg,
    },
    {
      name: "\u201CBetter Siri\u201D",
      tag: "Voice AI",
      desc: "A reimagined, genuinely useful AI voice assistant — shipped January 2026.",
      img: buildBetterSiriImg,
    },
    {
      name: "Ruby",
      tag: "Supply Chain",
      desc: "GoldRock AI's end-to-end AI supply-chain planning platform.",
      img: buildRubyImg,
    },
    {
      name: "55+ live AI products",
      tag: "The Portfolio",
      desc: "1.2M+ hours automated every year across the GoldRock AI portfolio.",
      img: buildPortfolioImg,
    },
  ];

const FOUNDER_STATS: { value: string; label: string }[] = [
  { value: "55+", label: "live AI products shipped" },
  { value: "1.2M+", label: "hours automated every year" },
  { value: "<1 day", label: "to design & ship this site" },
  { value: "The Guardian", label: "featured for AI red-teaming" },
];

const FOUNDER_PRINCIPLES: {
  icon: LucideIcon;
  title: string;
  desc: string;
}[] = [
  {
    icon: DraftingCompass,
    title: "Architect first",
    desc: "Every venture starts as a blueprint, not a prompt — systems designed to ship, scale, and actually make money.",
  },
  {
    icon: Zap,
    title: "Operator velocity",
    desc: "This entire site was designed and shipped in under a day. You're buying production speed, not slideware.",
  },
  {
    icon: ShieldCheck,
    title: "Hardened by red-teaming",
    desc: "The same instincts that broke an unreleased AI model — reported in The Guardian — go into hardening everything we ship.",
  },
];

const FOUNDER_CREDENTIALS: {
  icon: LucideIcon;
  label: string;
  detail: string;
}[] = [
  {
    icon: Building2,
    label: "Founder, SCAR",
    detail:
      "Supply Chain Automation & Robotics Institute at the University of Tennessee.",
  },
  {
    icon: Award,
    label: "P&G Innovator of the Quarter",
    detail:
      "Supply-chain FDE & digital-department accelerator at Procter & Gamble.",
  },
  {
    icon: Trophy,
    label: "VolHacks IV Winner",
    detail: "Took the University of Tennessee's flagship hackathon.",
  },
  {
    icon: GraduationCap,
    label: "VolGreat 2021 Notable Alumnus",
    detail: "Recognized among UT's standout builders.",
  },
  {
    icon: Sparkles,
    label: "Hackathon organizer",
    detail: "Runs hackathons at Vanderbilt University.",
  },
  {
    icon: Star,
    label: "Clutch.co Top Supply-Chain Consultant",
    detail: "Ranked among the best worldwide.",
  },
];

const FOUNDER_RECOGNITION: string[] = [
  "Tetsuo AI",
  "TBPN",
  "Amjad Masad (Replit)",
];

const FAQ: { q: string; a: string }[] = [
  {
    q: "Who is utk.ai for?",
    a: "Serious founders who want a real, revenue-ready company built for them, and ambitious people ready to invest in becoming elite AI builders. We work with a small number of committed clients at a time — if you're after free advice or a casual course, this isn't it.",
  },
  {
    q: "Is everything paid? How much?",
    a: "Yes — every engagement is paid and premium. Done-for-you studio builds run $5,000 to $25,000+ depending on scope. 1:1 coaching is $1,500 per hour. Internships are $4,000 per month. This is senior, hands-on, operator-level work, priced accordingly.",
  },
  {
    q: "Wait — interns pay you?",
    a: "Correct. Our internships are a paid program you invest in: you pay to train inside live, revenue-generating AI teams. In return you get elite real-world skills, a portfolio-grade product you actually shipped, and a résumé that opens doors. It's an accelerator, not a job — and the experience is worth far more than the price.",
  },
  {
    q: "Do you ever take equity instead of cash?",
    a: "On select studio engagements we'll structure part of the deal as equity or a hybrid — but equity is on top of payment, never instead of it. Equity partners still pay, and they pay well. We invest our time alongside serious operators, not in place of being paid.",
  },
  {
    q: "Why is it so expensive?",
    a: "Because you work directly with operators behind 55+ live AI products and 1.2M+ automated hours a year — not juniors, not a content library. The price reflects the caliber of the people and the speed and quality of what you get. If cost is the deciding factor, we're probably not the right fit.",
  },
  {
    q: "How fast can you build my business?",
    a: "Most studio builds launch in weeks, not months. We work on GoldRock AI's production stack, so we skip the slow parts and ship the thing that actually moves the needle.",
  },
  {
    q: "How does the process work?",
    a: "Five steps: Blueprint, Architect, Build, Launch, Handoff. We pressure-test the idea, design the systems, build with operators (not juniors), ship to real users, then hand you the keys with clean code and full docs.",
  },
  {
    q: "Do I own the code and IP?",
    a: "100%. At handoff you get clean code, full documentation, and the keys to every system. No lock-in, nothing held hostage — it's your company. (Where an equity arrangement is agreed, the terms are spelled out up front.)",
  },
  {
    q: "Do I need to know how to code?",
    a: "For studio builds, no — we build it for you. For internships and coaching, come hungry, coachable, and technically curious; we'll take you from there toward top-1% builder.",
  },
  {
    q: "How do I start?",
    a: "Apply, or send a detailed message through the form below — the more specific you are about your goals, budget, and timeline, the faster we can tell you if it's a fit. We answer serious inquiries first.",
  },
];

const INTEREST_OPTIONS = [
  "Build my business (studio)",
  "Buy a turnkey AI platform / website",
  "1:1 Coaching ($1,500/hr)",
  "AI training internship ($4K/mo)",
  "Equity / partnership",
  "Something else",
];
const BUDGET_OPTIONS = [
  "Under $5K",
  "$5K – $25K",
  "$25K – $100K",
  "$100K+",
  "Coaching / monthly",
  "Not sure yet",
];
const TIMELINE_OPTIONS = [
  "ASAP — this month",
  "1–3 months",
  "3–6 months",
  "Just exploring",
];

const contactFieldClass =
  "flex h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

function ContactSection() {
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: "",
    email: "",
    interest: "",
    budget: "",
    timeline: "",
    message: "",
    website: "",
  });

  const createMessage = useCreateContactMessage({
    mutation: {
      onSuccess: () => {
        toast({
          title: "Inquiry sent",
          description:
            "Thanks for reaching out — we answer serious inquiries first and will be in touch soon.",
        });
        setForm({
          name: "",
          email: "",
          interest: "",
          budget: "",
          timeline: "",
          message: "",
          website: "",
        });
      },
      onError: () => {
        toast({
          title: "Couldn't send your inquiry",
          description: "Please try again in a moment.",
          variant: "destructive",
        });
      },
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (createMessage.isPending) return;
    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.message.trim() ||
      !form.interest
    ) {
      toast({
        title: "Please add your name, email, what you need, and a message.",
        variant: "destructive",
      });
      return;
    }
    const details = [
      `Interested in: ${form.interest}`,
      form.budget ? `Budget: ${form.budget}` : null,
      form.timeline ? `Timeline: ${form.timeline}` : null,
    ]
      .filter(Boolean)
      .join("\n");
    createMessage.mutate({
      data: {
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.interest,
        message: `${details}\n\n${form.message.trim()}`,
        website: form.website,
      },
    });
  };

  return (
    <section
      id="contact"
      className="relative scroll-mt-24 overflow-hidden border-t border-border/60 bg-secondary/30 py-10 md:py-28"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--brand-sapphire)/0.05),transparent_60%)]" />
      <div className="container relative z-10 mx-auto max-w-2xl px-5 md:px-6">
        <motion.div {...fadeInUp} className="mb-5 md:mb-10 text-center">
          <p className="mb-3 md:mb-4 inline-flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            <Mail className="h-3.5 w-3.5" /> Start the conversation
          </p>
          <h2 className="font-display text-3xl font-semibold tracking-tight md:text-6xl">
            Let's talk about your{" "}
            <span className="text-gradient-flow italic">next move.</span>
          </h2>
          <p className="mt-3 md:mt-4 text-base md:text-lg font-light text-muted-foreground">
            Tell us what you need, your budget, and your timeline. The more
            specific you are, the faster we'll tell you if it's a fit — we answer
            serious inquiries first.
          </p>
        </motion.div>

        <motion.form
          {...fadeInUp}
          onSubmit={handleSubmit}
          className="relative rounded-3xl border border-card-border bg-card p-4 shadow-[0_2px_30px_-18px_rgba(0,0,0,0.15)] md:p-8"
        >
          {/* Honeypot — hidden from humans, catches bots */}
          <div
            className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden"
            aria-hidden="true"
          >
            <label htmlFor="contact-website">Website</label>
            <input
              id="contact-website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={form.website}
              onChange={(e) =>
                setForm((f) => ({ ...f, website: e.target.value }))
              }
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2 sm:gap-5">
            <div className="space-y-1.5 md:space-y-2">
              <Label htmlFor="contact-name">Name</Label>
              <Input
                id="contact-name"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                maxLength={100}
                required
                placeholder="Your name"
              />
            </div>
            <div className="space-y-1.5 md:space-y-2">
              <Label htmlFor="contact-email">Email</Label>
              <Input
                id="contact-email"
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                required
                placeholder="you@email.com"
              />
            </div>
          </div>

          <div className="mt-3 grid gap-3 sm:mt-5 sm:grid-cols-2 sm:gap-5">
            <div className="space-y-1.5 md:space-y-2">
              <Label htmlFor="contact-interest">What do you need?</Label>
              <select
                id="contact-interest"
                value={form.interest}
                onChange={(e) =>
                  setForm((f) => ({ ...f, interest: e.target.value }))
                }
                required
                className={contactFieldClass}
              >
                <option value="" disabled>
                  Choose one…
                </option>
                {INTEREST_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5 md:space-y-2">
              <Label htmlFor="contact-budget">
                Budget{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </Label>
              <select
                id="contact-budget"
                value={form.budget}
                onChange={(e) =>
                  setForm((f) => ({ ...f, budget: e.target.value }))
                }
                className={contactFieldClass}
              >
                <option value="">Select a range…</option>
                {BUDGET_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-3 space-y-1.5 sm:mt-5 md:space-y-2">
            <Label htmlFor="contact-timeline">
              Timeline{" "}
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
            </Label>
            <select
              id="contact-timeline"
              value={form.timeline}
              onChange={(e) =>
                setForm((f) => ({ ...f, timeline: e.target.value }))
              }
              className={contactFieldClass}
            >
              <option value="">When do you want to start?</option>
              {TIMELINE_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-3 space-y-1.5 sm:mt-5 md:space-y-2">
            <Label htmlFor="contact-message">Tell us about your project</Label>
            <Textarea
              id="contact-message"
              value={form.message}
              onChange={(e) =>
                setForm((f) => ({ ...f, message: e.target.value }))
              }
              rows={4}
              maxLength={4000}
              required
              placeholder="What are you building or trying to learn? The specifics help us help you faster…"
            />
          </div>

          <button
            type="submit"
            disabled={createMessage.isPending}
            className="btn-shine mt-4 md:mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-flow px-7 py-3 md:py-3.5 text-sm font-semibold uppercase tracking-wider text-white shadow-[0_12px_30px_-10px_hsl(var(--brand-teal)/0.6)] transition-transform duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {createMessage.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending…
              </>
            ) : (
              <>
                Send inquiry
                <Send className="h-4 w-4" />
              </>
            )}
          </button>
        </motion.form>
      </div>
    </section>
  );
}

function AnimatedCounter({
  value,
  duration = 2,
}: {
  value: number;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView || !ref.current) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(eased * value);
      if (ref.current) {
        ref.current.textContent =
          value > 1000
            ? (current / 1000000).toFixed(1) + "M"
            : current.toString() + "+";
      }
      if (progress < 1) requestAnimationFrame(step);
      else if (ref.current)
        ref.current.textContent = value > 1000 ? "1.2M" : value + "+";
    };
    requestAnimationFrame(step);
  }, [inView, value, duration]);

  return <span ref={ref}>0</span>;
}

function BusinessHeroVideo() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const label =
    "Students building businesses together, teams collaborating, and elite one-on-one coaching";

  if (reduced) {
    return (
      <img
        src={businessHeroPoster}
        alt={label}
        className="aspect-[4/5] w-full object-cover"
      />
    );
  }

  return (
    <video
      src={businessHeroVideo}
      poster={businessHeroPoster}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={label}
      className="aspect-[4/5] w-full object-cover"
    />
  );
}

function ExplainerVideo() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const label =
    "How utk.ai works: building AI companies, elite one-on-one coaching, and shipping real products";

  if (reduced) {
    return (
      <img
        src={explainerPoster}
        alt={label}
        className="aspect-video w-full object-cover"
      />
    );
  }

  return (
    <video
      src={explainerVideo}
      poster={explainerPoster}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={label}
      className="aspect-video w-full object-cover"
    />
  );
}

function FounderVideo() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const label =
    "From blueprint to shipped product: how one operator architects, builds, and scales AI ventures";

  if (reduced) {
    return (
      <img
        src={founderPoster}
        alt={label}
        className="h-full w-full object-cover"
      />
    );
  }

  return (
    <video
      src={founderVideo}
      poster={founderPoster}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={label}
      className="h-full w-full object-cover"
    />
  );
}

function ManifestoVideo() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const label =
    "Walking out of the lecture hall to build real AI products, master modern tools, and ship like an operator";

  if (reduced) {
    return (
      <img
        src={manifestoPoster}
        alt={label}
        className="aspect-video w-full object-cover"
      />
    );
  }

  return (
    <video
      src={manifestoVideo}
      poster={manifestoPoster}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={label}
      className="aspect-video w-full object-cover"
    />
  );
}

function PrimaryButton({
  children,
  onClick,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`btn-shine group relative inline-flex items-center justify-center gap-2 rounded-full bg-gradient-flow px-8 py-4 text-sm font-semibold uppercase tracking-wider text-white shadow-[0_10px_30px_-8px_hsl(var(--brand-teal)/0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-10px_hsl(var(--brand-teal)/0.7)] ${className}`}
    >
      {children}
    </button>
  );
}

function ApplyDialog({
  type,
  onClose,
  onTypeChange,
}: {
  type: ApplicationType | null;
  onClose: () => void;
  onTypeChange: (t: ApplicationType) => void;
}) {
  const { isSignedIn, user, isLoaded } = useUser();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
    budget: "",
  });

  const open = type !== null;

  useEffect(() => {
    if (open) {
      setDone(false);
      setForm((f) => ({
        ...f,
        name: user?.fullName ?? f.name,
        email: user?.primaryEmailAddress?.emailAddress ?? f.email,
      }));
    }
  }, [open, user]);

  const createApp = useCreateApplication({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getListMyApplicationsQueryKey() });
        setDone(true);
      },
      onError: () => {
        toast({
          title: "Something went wrong",
          description: "Please try again in a moment.",
          variant: "destructive",
        });
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!type) return;
    createApp.mutate({
      data: {
        type,
        name: form.name.trim(),
        email: form.email.trim(),
        company: form.company.trim() || null,
        message: form.message.trim(),
        budget: form.budget.trim() || null,
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg border-card-border bg-card/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="font-display text-3xl font-semibold tracking-tight">
            {done ? "Request received" : "Begin your application"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {done
              ? "We review every request personally and will reach out soon."
              : "Tell us about you. This goes straight to our studio team."}
          </DialogDescription>
        </DialogHeader>

        {done ? (
          <div className="flex flex-col items-center py-5 md:py-8 text-center">
            <CheckCircle2 className="mb-4 h-14 w-14 text-accent" />
            <p className="max-w-xs text-muted-foreground">
              Track its status anytime in your portal.
            </p>
            <div className="mt-4 md:mt-6 flex gap-3">
              <Link href="/portal">
                <PrimaryButton>Go to portal</PrimaryButton>
              </Link>
              <Button variant="ghost" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        ) : !isLoaded ? (
          <div className="py-10 text-center text-muted-foreground">Loading…</div>
        ) : !isSignedIn ? (
          <div className="py-6 text-center">
            <p className="mb-4 md:mb-6 text-muted-foreground">
              Create an account or sign in to submit your request and track its
              status.
            </p>
            <div className="flex justify-center gap-3">
              <a href={`${basePath}/sign-up`}>
                <PrimaryButton>Create account</PrimaryButton>
              </a>
              <a href={`${basePath}/sign-in`}>
                <Button
                  variant="outline"
                  className="rounded-full border-primary/30 text-primary hover:bg-primary/5"
                >
                  Sign in
                </Button>
              </a>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="mb-2 block">Program</Label>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {(Object.keys(TYPE_META) as ApplicationType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => onTypeChange(t)}
                    className={`rounded-xl border px-2 py-2 text-xs font-medium transition-colors ${
                      type === t
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {TYPE_META[t].label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="name" className="mb-2 block">
                  Name
                </Label>
                <Input
                  id="name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="email" className="mb-2 block">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="company" className="mb-2 block">
                  Company <span className="text-muted-foreground">(opt.)</span>
                </Label>
                <Input
                  id="company"
                  value={form.company}
                  onChange={(e) =>
                    setForm({ ...form, company: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="budget" className="mb-2 block">
                  Budget <span className="text-muted-foreground">(opt.)</span>
                </Label>
                <Input
                  id="budget"
                  value={form.budget}
                  onChange={(e) => setForm({ ...form, budget: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="message" className="mb-2 block">
                What do you want to build?
              </Label>
              <Textarea
                id="message"
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="resize-none"
              />
            </div>

            <PrimaryButton className="w-full">
              {createApp.isPending ? "Submitting…" : "Submit Request"}
            </PrimaryButton>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function Home() {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.4], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
  const [applyType, setApplyType] = useState<ApplicationType | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    document.documentElement.classList.remove("dark");
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };
  const openApply = (t: ApplicationType) => setApplyType(t);

  return (
    <MotionConfig reducedMotion="user">
    <div className="min-h-[100dvh] overflow-x-hidden bg-background font-sans text-foreground selection:bg-primary/20">
      <ApplyDialog
        type={applyType}
        onClose={() => setApplyType(null)}
        onTypeChange={setApplyType}
      />

      {/* NAV */}
      <nav
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "glass border-b border-border/60 shadow-[0_4px_30px_-12px_rgba(0,0,0,0.1)]"
            : "border-b border-transparent"
        }`}
      >
        {/* Announcement strip */}
        <div className={`${scrolled ? "hidden" : "hidden sm:block"} bg-gradient-flow text-white`}>
          <div className="container mx-auto flex h-9 items-center justify-center gap-3 px-5 text-[0.7rem] font-medium uppercase tracking-[0.2em] md:px-6">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
            </span>
            <span className="text-white/90">
              We build your dream business — faster &amp; cheaper than ever.
            </span>
            <button
              onClick={() => openApply("studio")}
              className="font-semibold underline-offset-4 transition-opacity hover:opacity-80 hover:underline"
            >
              Start now →
            </button>
          </div>
        </div>
        <div className="container mx-auto flex h-20 items-center justify-between px-5 md:px-6">
          <div className="flex items-center gap-2.5">
            <span className="font-display text-2xl font-semibold tracking-tight text-foreground">
              utk<span className="text-gradient-flow">.ai</span>
            </span>
            <span className="hidden h-5 w-px bg-border md:block lg:hidden xl:block" />
            <span className="hidden whitespace-nowrap text-[0.66rem] font-medium uppercase tracking-[0.2em] text-muted-foreground md:inline lg:hidden xl:inline">
              Unsloppable Tech Kickstarter AI
            </span>
          </div>
          <div className="hidden items-center gap-4 md:gap-6 text-xs font-medium uppercase tracking-widest text-muted-foreground lg:flex xl:gap-9">
            {[
              ["studio", "Build a Business"],
              ["internships", "Internships"],
              ["coaching", "Coaching"],
              ["services", "Services"],
              ["manifesto", "Skip College"],
              ["founder", "Founder"],
              ["projects", "Work"],
              ["contact", "Contact"],
            ].map(([id, label]) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className="relative transition-colors hover:text-foreground after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-primary after:transition-all hover:after:w-full"
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Show when="signed-out">
              <a
                href={`${basePath}/sign-in`}
                className="hidden text-xs font-medium uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground sm:block"
              >
                Sign In
              </a>
            </Show>
            <Show when="signed-in">
              <Link href="/portal">
                <Button
                  variant="ghost"
                  className="hidden h-10 gap-2 rounded-full text-foreground/80 hover:text-foreground sm:flex"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Portal
                </Button>
              </Link>
            </Show>
            <PrimaryButton
              onClick={() => openApply("studio")}
              className="px-6 py-2.5 text-xs"
            >
              Apply Now
            </PrimaryButton>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative flex min-h-[100dvh] flex-col justify-start overflow-hidden pt-20 pb-10 sm:pt-32 sm:pb-20 md:justify-center md:pt-36 md:pb-24">
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0 z-0"
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={businessBgPoster}
            className="h-full w-full object-cover"
          >
            <source src={businessBgVideo} type="video/mp4" />
          </video>
          {/* Light luxury wash so text stays crisp & readable */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/40 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/85 via-white/30 to-transparent" />
        </motion.div>

        {/* Ambient ocean aurora */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div className="absolute -left-24 top-[18%] h-72 w-72 rounded-full bg-[radial-gradient(circle,hsl(var(--brand-aqua)/0.18),transparent_70%)] blur-2xl animate-[float-slow_15s_ease-in-out_infinite] motion-reduce:animate-none" />
          <div className="absolute -right-16 bottom-[14%] h-80 w-80 rounded-full bg-[radial-gradient(circle,hsl(var(--brand-emerald)/0.14),transparent_70%)] blur-2xl animate-[aurora_18s_ease-in-out_infinite] motion-reduce:animate-none" />
        </div>

        <div className="container relative z-10 mx-auto px-5 md:px-6">
          <motion.div
            variants={heroStagger}
            initial="hidden"
            animate="show"
          >
            <div className="grid items-center gap-6 md:grid-cols-[1.05fr_0.95fr] md:gap-10 lg:gap-14">
              {/* Left — copy */}
              <div className="max-w-2xl">
                <motion.div
                  variants={heroItem}
                  className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-primary/20 bg-white/70 px-4 py-1.5 text-[0.66rem] font-medium uppercase tracking-[0.2em] text-primary shadow-[0_8px_24px_-16px_hsl(var(--brand-teal)/0.6)] backdrop-blur-sm sm:mb-6 sm:text-[0.7rem]"
                >
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[hsl(var(--brand-emerald)/0.7)] motion-reduce:hidden" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[hsl(var(--brand-emerald))]" />
                  </span>
                  Now accepting applications
                  <span className="hidden h-3 w-px bg-primary/25 sm:inline-block" />
                  <span className="hidden text-muted-foreground sm:inline">
                    Limited 2026 cohort
                  </span>
                </motion.div>

                <motion.h1
                  variants={heroItem}
                  className="font-display text-[2.35rem] font-semibold leading-[1.02] tracking-tight text-foreground min-[400px]:text-[2.7rem] sm:text-5xl lg:text-6xl xl:text-7xl"
                >
                  We build your{" "}
                  <span className="text-gradient-flow italic">dream business</span>
                  <span className="text-foreground"> — faster &amp; cheaper than ever.</span>
                </motion.h1>

                <motion.p
                  variants={heroItem}
                  className="mt-5 max-w-xl text-[1.02rem] font-light leading-relaxed text-foreground/80 sm:mt-6 sm:text-lg"
                >
                  Done-for-you AI companies, elite training, and live internships
                  — the unsloppable tech kickstarter behind{" "}
                  <span className="font-medium text-foreground">
                    55+ shipped products.
                  </span>
                </motion.p>

                <motion.div
                  variants={heroItem}
                  className="mt-5 md:mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:gap-4"
                >
                  <PrimaryButton
                    onClick={() => openApply("studio")}
                    className="px-9 py-4"
                  >
                    Build My Business
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </PrimaryButton>
                  <button
                    onClick={() => scrollToSection("studio")}
                    className="group inline-flex items-center justify-center gap-2 rounded-full border border-foreground/15 bg-white/60 px-9 py-4 text-sm font-semibold uppercase tracking-wider text-foreground backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:bg-white/90"
                  >
                    Explore Programs
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </motion.div>

                <motion.div
                  variants={heroItem}
                  className="mt-5 md:mt-7 grid max-w-md grid-cols-3 divide-x divide-border/70 sm:mt-8"
                >
                  {(
                    [
                      ["55+", "Products shipped"],
                      ["1.2M", "Hrs/yr automated"],
                      ["100%", "Yours to own"],
                    ] as [string, string][]
                  ).map(([v, l]) => (
                    <div key={l} className="min-w-0 px-3 first:pl-0 sm:px-6">
                      <div className="font-display text-2xl font-semibold leading-none text-gradient-flow sm:text-3xl">
                        {v}
                      </div>
                      <div className="mt-1.5 text-[0.6rem] font-medium uppercase tracking-[0.16em] text-muted-foreground sm:text-[0.66rem]">
                        {l}
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Right — business video montage showcase */}
              <motion.div
                variants={heroItem}
                className="relative mx-auto w-full max-w-[230px] min-[400px]:max-w-[260px] sm:max-w-[300px] md:mx-0 md:ml-auto md:max-w-[330px] lg:max-w-[400px]"
              >
                <div className="pointer-events-none absolute -inset-6 -z-0 bg-[radial-gradient(circle_at_50%_45%,hsl(var(--brand-aqua)/0.4),transparent_70%)] blur-2xl animate-[glow-pulse_7s_ease-in-out_infinite] motion-reduce:animate-none" />
                <div className="relative rounded-[1.75rem] bg-gradient-flow p-px shadow-[0_30px_70px_-30px_hsl(var(--brand-teal)/0.6)]">
                  <div className="overflow-hidden rounded-[calc(1.75rem-1px)] border border-white/50 bg-secondary/30">
                    <BusinessHeroVideo />
                    <div className="flex items-center justify-between gap-2 border-t border-white/40 bg-white/55 px-4 py-2.5 backdrop-blur-md">
                      <span className="font-display text-sm font-semibold tracking-tight text-foreground">
                        Built Together
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-[0.6rem] font-medium uppercase tracking-[0.16em] text-primary">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[hsl(var(--brand-emerald)/0.7)] motion-reduce:hidden" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[hsl(var(--brand-emerald))]" />
                        </span>
                        Live cohort
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              variants={heroStagger}
              className="mt-5 md:mt-8 grid gap-2.5 sm:mt-12 sm:gap-4 sm:grid-cols-3"
            >
              {(
                [
                  {
                    img: iconRocket,
                    title: "We Build Your Business",
                    desc: "Your dream company, built for you — faster & cheaper than ever before.",
                  },
                  {
                    img: iconCap,
                    title: "Cutting-Edge AI Training",
                    desc: "Learn to build like the top 1% of AI engineers.",
                  },
                  {
                    img: iconTarget,
                    title: "Hands-On Internships",
                    desc: "Train inside real, live, revenue-generating AI teams.",
                  },
                ] as { img: string; title: string; desc: string }[]
              ).map((p, i) => (
                <motion.div
                  key={p.title}
                  variants={heroItem}
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  className="group/card relative flex items-center gap-3 overflow-hidden rounded-xl border border-card-border bg-white/65 p-3 backdrop-blur-md transition-colors duration-300 hover:border-primary/30 hover:bg-white/85 hover:shadow-[0_26px_50px_-26px_hsl(var(--brand-teal)/0.5)] sm:flex-col sm:items-start sm:gap-0 sm:rounded-2xl sm:p-5"
                >
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-flow opacity-0 transition-opacity duration-300 group-hover/card:opacity-100" />
                  <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-card-border bg-gradient-to-b from-white to-secondary/50 shadow-[0_8px_24px_-10px_hsl(var(--brand-teal)/0.5)] transition-transform duration-300 group-hover/card:scale-110 sm:mb-3 sm:h-14 sm:w-14 sm:rounded-xl">
                    <img
                      src={p.img}
                      alt=""
                      aria-hidden="true"
                      className="h-6 w-6 object-contain drop-shadow-[0_6px_12px_hsl(var(--brand-teal)/0.4)] animate-[crystal-bob_6s_ease-in-out_infinite] motion-reduce:animate-none sm:h-9 sm:w-9"
                      style={{ animationDelay: `${i * 0.5}s` }}
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display text-sm font-semibold tracking-tight text-foreground sm:text-base">
                      {p.title}
                    </h3>
                    <p className="mt-0.5 line-clamp-2 text-xs font-light leading-snug text-muted-foreground sm:mt-1 sm:line-clamp-none sm:text-sm sm:leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        <motion.button
          onClick={() => scrollToSection("studio")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          aria-label="Scroll to explore"
          className="absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-[0.6rem] font-medium uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-primary md:flex"
        >
          Scroll
          <ChevronRight className="h-4 w-4 rotate-90 animate-bounce motion-reduce:animate-none" />
        </motion.button>
      </section>

      {/* TRUST MARQUEE */}
      <section className="relative flex items-center overflow-hidden border-y border-border/60 bg-secondary/40 py-4 md:py-7">
        <div className="absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-background to-transparent" />
        <div className="absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-background to-transparent" />
        <div className="flex animate-[marquee_42s_linear_infinite] items-center gap-16 whitespace-nowrap px-8">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex shrink-0 items-center gap-16">
              {(
                [
                  [<FaAws className="h-7 w-7" />, "AWS"],
                  [<SiAnthropic className="h-7 w-7" />, "Anthropic"],
                  [<SiOpenai className="h-7 w-7" />, "OpenAI"],
                  [<SiGooglecloud className="h-7 w-7" />, "Google Cloud"],
                  [<FaMicrosoft className="h-7 w-7" />, "Azure"],
                  [<SiNvidia className="h-7 w-7" />, "NVIDIA"],
                  [<SiHuggingface className="h-7 w-7" />, "Hugging Face"],
                  [<SiVercel className="h-7 w-7" />, "Vercel"],
                  [<SiSupabase className="h-7 w-7" />, "Supabase"],
                  [<SiStripe className="h-7 w-7" />, "Stripe"],
                ] as [ReactNode, string][]
              ).map(([icon, label], j) => (
                <div
                  key={j}
                  className="flex items-center gap-3 text-foreground/35 transition-colors duration-500 hover:text-primary"
                >
                  {icon}
                  <span className="text-lg font-semibold tracking-tight">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* IMPACT BAND */}
      <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-background via-secondary/30 to-background py-9 md:py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--brand-teal)/0.06),transparent_70%)]" />
        <div className="container relative z-10 mx-auto px-5 md:px-6">
          <motion.p
            {...fadeInUp}
            className="mb-6 md:mb-10 text-center text-xs font-semibold uppercase tracking-[0.3em] text-primary"
          >
            Proof, not promises
          </motion.p>
          <div className="grid grid-cols-2 gap-y-10 md:grid-cols-4">
            {(
              [
                { el: <AnimatedCounter value={55} />, label: "Live products shipped" },
                {
                  el: <AnimatedCounter value={1200000} duration={3} />,
                  label: "Hours / year automated",
                },
                { el: "10×", label: "Faster to launch" },
                { el: "100%", label: "Yours to own" },
              ] as { el: ReactNode; label: string }[]
            ).map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
                className="flex flex-col items-center text-center md:border-l md:border-border/60 md:first:border-l-0"
              >
                <div className="font-display text-3xl font-semibold text-gradient-flow sm:text-5xl md:text-6xl">
                  {s.el}
                </div>
                <div className="mt-3 max-w-[10rem] text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FLAGSHIPS */}
      <section
        id="flagships"
        className="relative scroll-mt-24 overflow-hidden border-b border-border/60 py-10 md:py-28"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--brand-aqua)/0.06),transparent_60%)]" />
        <div className="container relative z-10 mx-auto px-5 md:px-6">
          <motion.div {...fadeInUp} className="mx-auto mb-5 md:mb-12 max-w-2xl text-center">
            <p className="mb-4 inline-flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Flagships
            </p>
            <h2 className="font-display text-3xl font-semibold tracking-tight md:text-6xl">
              Businesses we built —{" "}
              <span className="text-gradient-flow italic">live in the wild.</span>
            </h2>
            <p className="mt-4 text-base md:text-lg font-light text-muted-foreground">
              Not mockups. Not case studies. Real, revenue-ready products you can
              open in a new tab right now.
            </p>
          </motion.div>

          {/* Featured flagship */}
          <motion.a
            href={FLAGSHIPS[0].url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: EASE }}
            className="group mb-5 grid overflow-hidden rounded-3xl border border-card-border bg-card shadow-[0_2px_24px_-14px_rgba(0,0,0,0.18)] transition-all duration-500 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_30px_60px_-26px_hsl(var(--brand-teal)/0.45)] lg:mb-5 lg:grid-cols-2"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-secondary/40 lg:aspect-auto">
              <img
                src={FLAGSHIPS[0].img}
                alt={FLAGSHIPS[0].name}
                loading="lazy"
                className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-white/85 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-widest text-primary backdrop-blur-md">
                <Sparkles className="h-3 w-3" /> Featured flagship
              </div>
            </div>
            <div className="flex min-w-0 flex-col justify-center p-5 md:p-10">
              <p className="text-[0.7rem] font-semibold uppercase tracking-widest text-accent">
                {FLAGSHIPS[0].tagline}
              </p>
              <h3 className="mt-2 break-words font-display text-2xl font-semibold tracking-tight transition-colors group-hover:text-primary min-[400px]:text-3xl md:text-4xl">
                {FLAGSHIPS[0].name}
              </h3>
              <p className="mt-4 text-base font-light leading-relaxed text-muted-foreground">
                {FLAGSHIPS[0].value}
              </p>
              <div className="mt-4 md:mt-6 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary">
                  <Sparkles className="h-3.5 w-3.5" /> {FLAGSHIPS[0].highlight}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-primary">
                  Visit
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </div>
            </div>
          </motion.a>

          {/* Remaining flagships */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FLAGSHIPS.slice(1).map((f, i) => (
              <motion.a
                key={f.name}
                href={f.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.07, ease: EASE }}
                className="group flex flex-col overflow-hidden rounded-2xl border border-card-border bg-card shadow-[0_2px_20px_-14px_rgba(0,0,0,0.15)] transition-all duration-500 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_24px_50px_-24px_hsl(var(--brand-teal)/0.4)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden border-b border-card-border bg-secondary/40">
                  <img
                    src={f.img}
                    alt={f.name}
                    loading="lazy"
                    className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
                <div className="flex min-w-0 flex-grow flex-col items-center p-5 text-center">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-accent">
                    {f.tagline}
                  </p>
                  <h3 className="mt-1.5 max-w-full break-words font-display text-lg font-semibold tracking-tight transition-colors group-hover:text-primary">
                    {f.name}
                  </h3>
                  <p className="mt-2 flex-grow text-sm font-light leading-relaxed text-muted-foreground">
                    {f.value}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-[0.7rem] font-semibold text-primary">
                    {f.highlight}
                  </span>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* PROOF OF PRODUCTION */}
      <section
        id="proof"
        className="relative scroll-mt-24 overflow-hidden border-b border-border/60 py-10 md:py-28"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,hsl(var(--brand-sapphire)/0.07),transparent_60%)]" />
        <div className="container relative z-10 mx-auto px-5 md:px-6">
          <motion.div {...fadeInUp} className="mx-auto mb-5 md:mb-12 max-w-2xl text-center">
            <p className="mb-4 inline-flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              <TrendingUp className="h-3.5 w-3.5" /> Proof of production
            </p>
            <h2 className="font-display text-3xl font-semibold tracking-tight md:text-6xl">
              One founder. Seven days.{" "}
              <span className="text-gradient-flow italic">$21,300.</span>
            </h2>
            <p className="mt-4 text-base md:text-lg font-light leading-relaxed text-muted-foreground">
              We don&apos;t just talk about AI-native speed — we bill at it.
              eformative.com was sold, built, and shipped for a client in a single
              seven-day sprint. That&apos;s the production rate behind everything
              here.
            </p>
          </motion.div>

          <motion.div
            {...fadeInUp}
            className="grid gap-5 md:gap-7 lg:grid-cols-[1.05fr_1fr]"
          >
            {/* eFormative case */}
            <a
              href="https://eformative.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-card-border bg-card shadow-[0_2px_24px_-16px_rgba(0,0,0,0.18)] transition-all duration-500 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_28px_56px_-26px_hsl(var(--brand-teal)/0.42)]"
            >
              <div className="relative aspect-[16/10] overflow-hidden border-b border-card-border bg-secondary/40">
                <img
                  src={eformativeImg}
                  alt="eformative.com — AI listing watchdog built in 7 days"
                  loading="lazy"
                  className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/85 px-3 py-1.5 text-[0.7rem] font-semibold text-primary backdrop-blur">
                  <Zap className="h-3.5 w-3.5" /> Client build · 7 days
                </span>
              </div>
              <div className="flex min-w-0 flex-grow flex-col p-5 md:p-7">
                <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-accent">
                  AI Listing Watchdog
                </p>
                <h3 className="mt-1.5 max-w-full break-words font-display text-2xl font-semibold tracking-tight transition-colors group-hover:text-primary">
                  eformative.com
                </h3>
                <p className="mt-3 flex-grow text-sm font-light leading-relaxed text-muted-foreground">
                  A real, paid client build — not a demo. Scoped, designed, built,
                  and delivered in seven days flat: an AI watchdog that scans 15+
                  markets around the clock and alerts the instant a match goes live.
                </p>
                <span className="mt-5 inline-flex w-fit items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                  See it live
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </div>
            </a>

            {/* Economics + model */}
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {(
                  [
                    { v: "$21,300", l: "Delivered for a client" },
                    { v: "7 days", l: "Sold to shipped" },
                    { v: "$1.1M+", l: "Annualized build capacity*" },
                  ] as { v: string; l: string }[]
                ).map((s) => (
                  <div
                    key={s.l}
                    className="flex flex-col items-center justify-center rounded-2xl border border-card-border bg-card p-3 text-center shadow-[0_2px_20px_-16px_rgba(0,0,0,0.15)] sm:p-4"
                  >
                    <div className="font-display text-xl font-semibold text-gradient-flow sm:text-3xl">
                      {s.v}
                    </div>
                    <div className="mt-2 text-[0.62rem] font-medium uppercase leading-tight tracking-[0.12em] text-muted-foreground">
                      {s.l}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-grow flex-col rounded-3xl border border-card-border bg-card p-5 md:p-7 shadow-[0_2px_24px_-16px_rgba(0,0,0,0.18)]">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  <Rocket className="h-4 w-4" /> Services become product IP
                </p>
                <p className="mt-3 text-sm font-light leading-relaxed text-foreground/85">
                  The breadth above isn&apos;t sprawl — it&apos;s the visible output
                  of one repeatable engine. Each paid build funds the studio,
                  surfaces real pain, and leaves behind reusable AI components that
                  compound into the product portfolio.
                </p>
                <div className="mt-5 grid gap-3 border-t border-border/60 pt-5">
                  {(
                    [
                      {
                        icon: Crosshair,
                        t: "Find the expensive workflow",
                        d: "Slow, human-heavy work that AI can compress.",
                      },
                      {
                        icon: Zap,
                        t: "Ship it in days, not quarters",
                        d: "One AI-native founder, agency output, a fraction of the time.",
                      },
                      {
                        icon: Workflow,
                        t: "Patterns compound into IP",
                        d: "Every build sharpens reusable product surfaces.",
                      },
                    ] as { icon: LucideIcon; t: string; d: string }[]
                  ).map(({ icon: Icon, t, d }) => (
                    <div key={t} className="flex items-start gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-flow text-white shadow-[0_8px_20px_-12px_hsl(var(--brand-teal)/0.7)]">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold leading-snug text-foreground">
                          {t}
                        </p>
                        <p className="mt-0.5 text-xs font-light leading-relaxed text-muted-foreground">
                          {d}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.p
            {...fadeInUp}
            className="mx-auto mt-4 md:mt-6 max-w-3xl text-center text-xs font-light leading-relaxed text-muted-foreground/80"
          >
            *Annualized build capacity is the seven-day pace repeated across a year
            — a measure of production rate, not recurring revenue.
          </motion.p>
        </div>
      </section>

      {/* FOUNDER */}
      <section
        id="founder"
        className="relative scroll-mt-24 overflow-hidden border-y border-border/60 py-10 md:py-28"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--brand-sapphire)/0.07),transparent_60%)]" />
        <div className="pointer-events-none absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-[hsl(var(--brand-teal)/0.08)] blur-3xl" />
        <div className="pointer-events-none absolute -right-40 bottom-10 h-96 w-96 rounded-full bg-[hsl(var(--brand-emerald)/0.08)] blur-3xl" />
        <div className="container relative z-10 mx-auto px-5 md:px-6">
          <motion.div {...fadeInUp} className="mx-auto mb-5 md:mb-12 max-w-2xl text-center">
            <p className="mb-4 inline-flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              <Sparkles className="h-3.5 w-3.5" /> The Architect
            </p>
            <h2 className="font-display text-3xl font-semibold tracking-tight md:text-6xl">
              Built by one operator —{" "}
              <span className="text-gradient-flow italic">not a committee.</span>
            </h2>
            <p className="mt-4 text-base md:text-lg font-light text-muted-foreground">
              Every system, automation, and venture here was architected by the
              same person you'd actually be working with — from adversarial AI
              red-teaming to full, revenue-ready AI companies.
            </p>
          </motion.div>

          {/* Cinematic top: identity + film */}
          <div className="grid items-stretch gap-4 md:gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-7">
            {/* Identity card */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: EASE }}
              className="relative flex flex-col overflow-hidden rounded-3xl border border-card-border bg-card shadow-[0_30px_60px_-30px_hsl(var(--brand-teal)/0.45)]"
            >
              <div className="absolute inset-x-0 top-0 z-20 h-1 bg-gradient-flow" />
              {/* Identity hero image + monogram */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={architectImg}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                <div className="absolute left-6 top-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-flow shadow-[0_10px_30px_-10px_hsl(var(--brand-teal)/0.7)]">
                  <span className="font-display text-2xl font-semibold tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
                    RS
                  </span>
                </div>
              </div>
              <div className="flex flex-grow flex-col p-5 md:p-9">
                <h3 className="font-display text-3xl font-semibold tracking-tight">
                  Ryan Siebert
                </h3>
                <p className="mt-1.5 text-sm font-medium text-primary">
                  Founder, GoldRock AI · Architect of utk.ai
                </p>
                <p className="mt-4 text-sm font-light leading-relaxed text-muted-foreground">
                  An AI product developer and supply-chain automation operator
                  who builds the systems most people only talk about — shipping
                  whole companies where others ship slide decks.
                </p>

                <div className="mt-4 md:mt-6 flex items-start gap-3 rounded-2xl border border-primary/25 bg-secondary/40 p-4">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-flow text-white">
                    <Zap className="h-4 w-4" />
                  </span>
                  <p className="text-sm leading-relaxed text-foreground/85">
                    <span className="font-semibold text-foreground">
                      This entire site
                    </span>{" "}
                    — designed, written, and shipped in under a single day.
                    That's the velocity you're hiring.
                  </p>
                </div>

                <a
                  href="https://goldrock.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-shine mt-auto inline-flex w-fit items-center gap-2 rounded-full bg-gradient-flow px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_-12px_hsl(var(--brand-teal)/0.7)] transition-transform hover:-translate-y-0.5"
                >
                  Visit GoldRock AI <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </motion.div>

            {/* Film card */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.08, ease: EASE }}
              className="relative min-h-[15rem] md:min-h-[22rem] overflow-hidden rounded-3xl border border-card-border bg-card shadow-[0_30px_60px_-30px_hsl(var(--brand-teal)/0.45)]"
            >
              <FounderVideo />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/20" />
              <div className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/30 px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-widest text-white backdrop-blur-md">
                <PlayCircle className="h-3.5 w-3.5" /> Blueprint → shipped
              </div>
              <div className="absolute inset-x-6 bottom-6">
                <p className="font-display text-2xl font-semibold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
                  How the work gets built
                </p>
                <p className="mt-1 max-w-md text-sm font-light text-white/85 drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)]">
                  From the first blueprint to a live, revenue-ready product — the
                  same operator at every step.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Stat band */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: EASE }}
            className="mt-4 md:mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-card-border bg-card-border md:grid-cols-4"
          >
            {FOUNDER_STATS.map((s) => (
              <div key={s.label} className="bg-card px-5 py-4 md:py-7 text-center">
                <p className="text-gradient-flow font-display text-3xl font-semibold leading-none tracking-tight md:text-4xl">
                  {s.value}
                </p>
                <p className="mx-auto mt-2.5 max-w-[12rem] text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </p>
              </div>
            ))}
          </motion.div>

          {/* Operating principles */}
          <div className="mt-4 md:mt-6 grid gap-4 md:gap-6 md:grid-cols-3">
            {FOUNDER_PRINCIPLES.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
                className="group rounded-3xl border border-card-border bg-card p-5 md:p-7 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_24px_50px_-28px_hsl(var(--brand-teal)/0.45)]"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-flow text-white shadow-[0_10px_24px_-12px_hsl(var(--brand-teal)/0.7)]">
                  <Icon className="h-5 w-5" />
                </span>
                <h4 className="mt-5 font-display text-lg font-semibold tracking-tight">
                  {title}
                </h4>
                <p className="mt-2 text-sm font-light leading-relaxed text-muted-foreground">
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Selected builds */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: EASE }}
            className="mt-4 md:mt-6 rounded-3xl border border-card-border bg-card p-5 md:p-9"
          >
            <div className="mb-4 md:mb-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  <Cpu className="h-4 w-4" /> Selected builds
                </p>
                <p className="mt-2 text-sm font-light text-muted-foreground">
                  A few of the 55+ products in the portfolio.
                </p>
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {FOUNDER_BUILDS.map((b) => (
                <div
                  key={b.name}
                  className="group overflow-hidden rounded-2xl border border-border/70 bg-secondary/30 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_22px_44px_-26px_hsl(var(--brand-teal)/0.5)]"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={b.img}
                      alt={b.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <span className="absolute left-3 top-3 rounded-full border border-primary/20 bg-white/85 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-widest text-primary backdrop-blur-md">
                      {b.tag}
                    </span>
                  </div>
                  <div className="p-4">
                    <p className="font-display text-base font-semibold tracking-tight">
                      {b.name}
                    </p>
                    <p className="mt-1 text-sm font-light leading-relaxed text-muted-foreground">
                      {b.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Guardian feature */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: EASE }}
            className="relative mt-4 md:mt-6 overflow-hidden rounded-3xl border border-card-border bg-card shadow-[0_30px_60px_-34px_hsl(var(--brand-teal)/0.5)]"
          >
            <div className="absolute inset-x-0 top-0 z-10 h-1 bg-gradient-flow" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,hsl(var(--brand-sapphire)/0.08),transparent_55%)]" />
            <div className="relative grid gap-5 md:gap-8 p-5 md:grid-cols-[0.82fr_1.18fr] md:p-10">
              {/* Masthead */}
              <div className="flex min-w-0 flex-col">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-flow text-white shadow-[0_10px_24px_-12px_hsl(var(--brand-teal)/0.7)]">
                  <Newspaper className="h-6 w-6" />
                </span>
                <p className="mt-5 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-primary">
                  {FOUNDER_PRESS.kicker} · {FOUNDER_PRESS.date}
                </p>
                <p className="mt-1.5 font-display text-4xl font-semibold leading-none tracking-tight md:text-5xl">
                  {FOUNDER_PRESS.outlet}
                </p>
                <p className="mt-4 text-sm font-light leading-relaxed text-muted-foreground">
                  A pre-release model. A single prompt injection. A responsible
                  disclosure to the company's president — on the record, in a
                  national feature.
                </p>

                {/* Others in the same story */}
                <div className="mt-4 md:mt-6 rounded-2xl border border-border/70 bg-secondary/40 p-4">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Others featured in the same story
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {FOUNDER_PRESS_FIGURES.map((f) => (
                      <span
                        key={f}
                        className="inline-flex items-center rounded-full border border-card-border bg-card px-3 py-1.5 text-xs font-medium text-foreground/80"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                <a
                  href={FOUNDER_PRESS.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-4 md:mt-6 inline-flex w-fit items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary transition-colors hover:text-foreground"
                >
                  Read it in The Guardian
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </div>

              {/* Story */}
              <div className="flex min-w-0 flex-col justify-center md:border-l md:border-border/60 md:pl-8">
                <h3 className="font-display text-2xl font-semibold leading-snug tracking-tight md:text-3xl">
                  {FOUNDER_PRESS.headline}
                </h3>
                <p className="mt-4 text-base font-light leading-relaxed text-foreground/85">
                  {FOUNDER_PRESS.context}
                </p>
                <blockquote className="mt-4 md:mt-6 border-l-2 border-primary/40 pl-5">
                  <Quote className="h-6 w-6 text-primary/40" />
                  <p className="mt-2 text-sm font-light italic leading-relaxed text-muted-foreground">
                    {FOUNDER_PRESS.quote}
                  </p>
                  <footer className="mt-3 text-xs font-semibold uppercase tracking-wider text-primary/80">
                    — {FOUNDER_PRESS.attribution}
                  </footer>
                </blockquote>
              </div>
            </div>
          </motion.div>

          {/* Credentials + recognition */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: EASE }}
            className="mt-4 md:mt-6 rounded-3xl border border-card-border bg-card p-5 md:p-9"
          >
            <div className="mb-5 md:mb-7 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  <Award className="h-4 w-4" /> Roles &amp; recognition
                </p>
                <p className="mt-2 text-sm font-light text-muted-foreground">
                  Founded institutes, won the awards, ranked worldwide — verifiable,
                  not vibes.
                </p>
              </div>
              <span className="hidden rounded-full border border-card-border bg-secondary/40 px-3.5 py-1.5 text-xs font-medium text-foreground/70 sm:inline-flex">
                On the record
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {FOUNDER_CREDENTIALS.map(({ icon: Icon, label, detail }) => (
                <div
                  key={label}
                  className="group flex items-start gap-3 rounded-2xl border border-border/70 bg-secondary/30 p-4 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_20px_40px_-26px_hsl(var(--brand-teal)/0.5)]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-flow text-white shadow-[0_8px_20px_-12px_hsl(var(--brand-teal)/0.7)]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold leading-snug text-foreground">
                      {label}
                    </p>
                    <p className="mt-1 text-xs font-light leading-relaxed text-muted-foreground">
                      {detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 md:mt-8 flex flex-col gap-4 border-t border-border/60 pt-6 sm:flex-row sm:items-center">
              <p className="flex shrink-0 items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                <Star className="h-3.5 w-3.5 text-primary" /> Shouted out by
              </p>
              <div className="flex flex-wrap gap-2">
                {FOUNDER_RECOGNITION.map((r) => (
                  <span
                    key={r}
                    className="inline-flex items-center gap-1.5 rounded-full border border-card-border bg-secondary/50 px-3.5 py-1.5 text-xs font-medium text-foreground/80"
                  >
                    <Sparkles className="h-3 w-3 text-primary" />
                    {r}
                  </span>
                ))}
                <span className="inline-flex items-center rounded-full border border-dashed border-border px-3.5 py-1.5 text-xs font-medium text-muted-foreground">
                  &amp; more
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* MANIFESTO — college is over */}
      <section
        id="manifesto"
        className="relative scroll-mt-24 overflow-hidden border-b border-border/60 py-10 md:py-28"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--brand-sapphire)/0.07),transparent_60%)]" />
        <div className="container relative z-10 mx-auto px-5 md:px-6">
          <motion.div {...fadeInUp} className="mx-auto mb-8 md:mb-12 max-w-3xl text-center">
            <p className="mb-4 inline-flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              <Sparkles className="h-3.5 w-3.5" /> The 2026 Reality
            </p>
            <h2 className="font-display text-3xl font-semibold tracking-tight md:text-6xl">
              College is the most expensive{" "}
              <span className="text-gradient-flow italic">mistake</span> of your
              life.
            </h2>
            <p className="mt-4 text-base md:text-lg font-light leading-relaxed text-muted-foreground">
              Four years and a fortune to memorize what AI now does in seconds —
              taught by people who've never shipped a thing, for a credential the
              market quietly stopped respecting. The degree was the safe bet of
              the last century. In the age of AI, "safe" is the riskiest move you
              can make.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mx-auto mb-9 md:mb-14 max-w-4xl overflow-hidden rounded-3xl border border-card-border bg-card shadow-[0_30px_60px_-30px_hsl(var(--brand-teal)/0.45)]"
          >
            <ManifestoVideo />
          </motion.div>

          <div className="mx-auto grid max-w-5xl gap-5 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, ease: EASE }}
              className="rounded-3xl border border-border/70 bg-secondary/40 p-5 md:p-9"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                The lecture hall
              </p>
              <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground/70">
                The old playbook
              </h3>
              <ul className="mt-4 md:mt-6 space-y-4">
                {OLD_WAY.map((t) => (
                  <li
                    key={t}
                    className="flex items-start gap-3 text-sm text-muted-foreground"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border bg-background text-[0.7rem] font-bold text-muted-foreground">
                      ×
                    </span>
                    <span className="line-through decoration-muted-foreground/40">
                      {t}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: 0.08, ease: EASE }}
              className="relative overflow-hidden rounded-3xl border border-primary/30 bg-card p-5 shadow-[0_24px_50px_-26px_hsl(var(--brand-teal)/0.45)] md:p-9"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-flow" />
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                The build path
              </p>
              <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight">
                The 2026 playbook
              </h3>
              <ul className="mt-4 md:mt-6 space-y-4">
                {NEW_WAY.map((t) => (
                  <li
                    key={t}
                    className="flex items-start gap-3 text-sm text-foreground/85"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          <motion.div {...fadeInUp} className="mx-auto mt-14 max-w-2xl text-center">
            <p className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
              Stop studying the future.{" "}
              <span className="text-gradient-flow italic">Start building it.</span>
            </p>
            <p className="mt-3 font-light text-muted-foreground">
              Skip the debt. Master the tools rewriting every industry. Build
              real businesses while your peers are still taking notes.
            </p>
            <div className="mt-5 md:mt-7 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => openApply("internship")}
                className="btn-shine inline-flex items-center justify-center gap-2 rounded-full bg-gradient-flow px-7 py-3.5 text-sm font-semibold uppercase tracking-wider text-white shadow-[0_12px_30px_-10px_hsl(var(--brand-teal)/0.6)] transition-transform duration-300 hover:-translate-y-0.5"
              >
                Train with us
                <ArrowUpRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => scrollToSection("studio")}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-card-border bg-card px-7 py-3.5 text-sm font-semibold uppercase tracking-wider text-foreground/80 transition-colors duration-300 hover:border-primary/40 hover:text-foreground"
              >
                See the paths
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PROGRAMS */}
      <section className="relative py-10 md:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--brand-aqua)/0.06),transparent_60%)]" />
        <div className="container relative z-10 mx-auto px-5 md:px-6">
          <motion.div {...fadeInUp} className="mx-auto mb-5 md:mb-12 max-w-2xl text-center">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              The Playbook
            </p>
            <h2 className="font-display text-3xl font-semibold tracking-tight md:text-6xl">
              Four paths into the{" "}
              <span className="text-gradient-flow italic">frontier.</span>
            </h2>
            <p className="mt-4 text-base md:text-lg font-light text-muted-foreground">
              We don't do theory. We build, ship, and scale — and we bring you
              with us. Here's every path, in full.
            </p>
          </motion.div>

          {/* All paths, stacked in full */}
          <div className="space-y-6 md:space-y-8 lg:space-y-10">
            {PLAYBOOK.map((p, i) => {
              const reverse = i % 2 === 1;
              return (
                <motion.div
                  key={p.id}
                  id={p.id}
                  initial={{ opacity: 0, y: 48 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="relative scroll-mt-28 overflow-hidden rounded-3xl border border-card-border bg-card shadow-[0_2px_30px_-12px_rgba(0,0,0,0.12)]"
                >
                  <div className="absolute inset-x-0 top-0 z-10 h-1 bg-gradient-flow" />
                  <div className="grid lg:grid-cols-2">
                    <div
                      className={`relative min-h-[170px] overflow-hidden lg:min-h-[520px] ${
                        reverse ? "lg:order-2" : ""
                      }`}
                    >
                      <img
                        src={p.img}
                        alt={p.title}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                      <div
                        className={`absolute inset-0 bg-gradient-to-t from-card via-card/10 to-transparent ${
                          reverse
                            ? "lg:bg-gradient-to-l lg:from-transparent lg:to-card"
                            : "lg:bg-gradient-to-r lg:from-transparent lg:to-card"
                        }`}
                      />
                      <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/30 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md">
                        <span className="text-gradient-flow">0{i + 1}</span>
                        {p.kicker}
                      </div>
                      <div className="absolute inset-x-5 bottom-5 flex flex-wrap gap-2">
                        {p.tags.map((t) => (
                          <span
                            key={t}
                            className="rounded-full border border-white/25 bg-black/30 px-3 py-1 text-xs font-medium text-white backdrop-blur-md"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col p-5 md:p-11">
                      <div className="mb-4 flex items-center gap-3">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-flow text-white shadow-[0_8px_24px_-8px_hsl(var(--brand-teal)/0.6)]">
                          <p.icon className="h-6 w-6" />
                        </span>
                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                          {p.kicker}
                        </span>
                      </div>
                      <h3 className="font-display text-2xl font-semibold tracking-tight md:text-4xl">
                        {p.title}
                      </h3>
                      <p className="mt-2 text-base md:text-lg font-medium text-primary">
                        {p.tagline}
                      </p>
                      <p className="mt-3 inline-flex w-fit items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-4 py-1.5 text-sm font-semibold">
                        <span className="text-gradient-flow">{p.price}</span>
                      </p>
                      <p className="mt-4 font-light leading-relaxed text-muted-foreground">
                        {p.desc}
                      </p>

                      <div className="mt-5 md:mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-card-border bg-card-border sm:grid-cols-4">
                        {p.metrics.map((m) => (
                          <div
                            key={m.label}
                            className="bg-card px-3 py-4 text-center transition-colors duration-300 hover:bg-muted/40"
                          >
                            <div className="text-gradient-flow font-display text-2xl font-semibold md:text-[1.75rem]">
                              {m.value}
                            </div>
                            <div className="mt-1 text-[0.6rem] font-medium uppercase tracking-wider text-muted-foreground">
                              {m.label}
                            </div>
                          </div>
                        ))}
                      </div>

                      <ul className="mt-5 md:mt-7 grid gap-3 sm:grid-cols-2">
                        {p.features.map((f) => (
                          <li
                            key={f}
                            className="flex items-start gap-2.5 text-sm text-foreground/80"
                          >
                            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>

                      {p.id === "studio" && (
                        <div className="mt-5 md:mt-7 flex flex-col sm:flex-row items-start gap-3 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.06] to-accent/[0.06] p-4 md:p-5">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-flow text-white shadow-[0_8px_24px_-8px_hsl(var(--brand-teal)/0.6)]">
                            <Handshake className="h-5 w-5" />
                          </span>
                          <div>
                            <p className="font-display text-base font-semibold tracking-tight">
                              We don't just build it — we may back it.
                            </p>
                            <p className="mt-1 text-sm font-light leading-relaxed text-muted-foreground">
                              When we believe in what we've built together, our
                              founder may choose to invest his own capital in
                              your company — always on top of the paid build,
                              never instead of it. It's optional and selective,
                              but when it happens you get a partner with real
                              skin in the game: aligned incentives and access to
                              capital as you grow.
                            </p>
                          </div>
                        </div>
                      )}

                      <button
                        onClick={() =>
                          p.type
                            ? openApply(p.type)
                            : scrollToSection("contact")
                        }
                        className="btn-shine mt-6 md:mt-9 inline-flex items-center justify-center gap-2 self-start rounded-full bg-gradient-flow px-7 py-3.5 text-sm font-semibold uppercase tracking-wider text-white shadow-[0_12px_30px_-10px_hsl(var(--brand-teal)/0.6)] transition-transform duration-300 hover:-translate-y-0.5"
                      >
                        {p.cta}
                        <ArrowUpRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* THE METHOD */}
      <section id="method" className="relative scroll-mt-24 overflow-hidden py-10 md:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,hsl(var(--brand-sapphire)/0.05),transparent_60%)]" />
        <div className="container relative z-10 mx-auto px-5 md:px-6">
          <motion.div {...fadeInUp} className="mx-auto mb-5 md:mb-12 max-w-2xl text-center">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              The Method
            </p>
            <h2 className="font-display text-3xl font-semibold tracking-tight md:text-6xl">
              From idea to{" "}
              <span className="text-gradient-flow italic">live company.</span>
            </h2>
            <p className="mt-4 text-base md:text-lg font-light text-muted-foreground">
              A precise, repeatable process — the same one behind 55+ shipped
              products. No bloat, no theater, just the path to launch.
            </p>
          </motion.div>

          <div className="relative">
            <div className="pointer-events-none absolute inset-x-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent lg:block" />
            <div className="grid gap-5 md:gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5">
              {METHOD.map((m, i) => (
                <motion.div
                  key={m.step}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
                  className="group relative"
                >
                  <div className="relative z-10 mb-5 flex h-20 w-20 items-center justify-center rounded-2xl border border-card-border bg-gradient-to-b from-white to-secondary/40 shadow-[0_18px_40px_-22px_hsl(var(--brand-teal)/0.5)] transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary/40 group-hover:shadow-[0_26px_50px_-24px_hsl(var(--brand-teal)/0.6)]">
                    <span className="pointer-events-none absolute inset-2 rounded-xl bg-[radial-gradient(circle_at_50%_40%,hsl(var(--brand-aqua)/0.3),transparent_70%)] opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
                    <img
                      src={m.img}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      className="h-12 w-12 object-contain drop-shadow-[0_8px_16px_hsl(var(--brand-teal)/0.4)] animate-[crystal-bob_5s_ease-in-out_infinite] motion-reduce:animate-none"
                      style={{ animationDelay: `${i * 0.4}s` }}
                    />
                    <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-flow text-[0.7rem] font-bold text-white shadow-[0_6px_16px_-6px_hsl(var(--brand-teal)/0.8)]">
                      {m.step}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-semibold tracking-tight">
                    {m.title}
                  </h3>
                  <p className="mt-2 text-sm font-light leading-relaxed text-muted-foreground">
                    {m.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — explainer video montage */}
      <section
        id="craft"
        className="relative scroll-mt-24 overflow-hidden border-y border-border/60 bg-gradient-to-b from-secondary/30 via-background to-secondary/30 py-10 md:py-28"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--brand-aqua)/0.07),transparent_60%)]" />
        <div className="container relative z-10 mx-auto px-5 md:px-6">
          <motion.div {...fadeInUp} className="mx-auto max-w-2xl text-center">
            <p className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              <Sparkles className="h-3.5 w-3.5" /> See it in action
            </p>
            <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight md:text-6xl">
              Your business,{" "}
              <span className="text-gradient-flow italic">built in motion.</span>
            </h2>
            <p className="mx-auto mt-4 md:mt-6 max-w-xl text-base md:text-lg font-light leading-relaxed text-muted-foreground">
              We design, build, and ship real AI companies for you — then train
              you to run them. Here's the whole thing, end to end.
            </p>
          </motion.div>

          <motion.div {...fadeInUp} className="relative mx-auto mt-8 md:mt-12 max-w-5xl">
            <div className="pointer-events-none absolute -inset-4 -z-0 rounded-[3rem] bg-[radial-gradient(ellipse_at_center,hsl(var(--brand-aqua)/0.22),transparent_70%)] blur-2xl" />
            <div className="relative overflow-hidden rounded-[1.75rem] ring-1 ring-card-border shadow-[0_40px_100px_-40px_hsl(var(--brand-teal)/0.55)] sm:rounded-[2rem]">
              <ExplainerVideo />
              <div className="pointer-events-none absolute inset-0 rounded-[1.75rem] ring-1 ring-inset ring-white/10 sm:rounded-[2rem]" />
            </div>
          </motion.div>

          <motion.div
            {...fadeInUp}
            className="mx-auto mt-8 md:mt-12 grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-3"
          >
            {(
              [
                {
                  icon: Rocket,
                  title: "We build",
                  desc: "Done-for-you AI companies, designed and shipped fast.",
                },
                {
                  icon: Compass,
                  title: "We coach",
                  desc: "Elite 1:1 guidance from the founder of GoldRock AI.",
                },
                {
                  icon: TrendingUp,
                  title: "You own & grow",
                  desc: "55+ products shipped. 1.2M hours automated a year.",
                },
              ] as { icon: LucideIcon; title: string; desc: string }[]
            ).map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-2xl border border-card-border bg-card/70 p-6 text-center backdrop-blur-sm sm:text-left"
              >
                <div className="mx-auto mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-flow text-white shadow-[0_10px_24px_-12px_hsl(var(--brand-teal)/0.7)] sm:mx-0">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-semibold">{title}</h3>
                <p className="mt-1.5 text-sm font-light leading-relaxed text-muted-foreground">
                  {desc}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CAPABILITIES */}
      <section className="relative overflow-hidden border-y border-border/60 bg-secondary/30 py-10 md:py-28">
        <div className="container relative z-10 mx-auto px-5 md:px-6">
          <motion.div {...fadeInUp} className="mx-auto mb-9 md:mb-14 max-w-2xl text-center">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Capabilities
            </p>
            <h2 className="font-display text-3xl font-semibold tracking-tight md:text-6xl">
              An arsenal of{" "}
              <span className="text-gradient-flow italic">what we build.</span>
            </h2>
            <p className="mt-4 text-base md:text-lg font-light text-muted-foreground">
              Whatever your company needs to run on AI, we've shipped it before —
              to production, for real users.
            </p>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CAPABILITIES.map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.55, delay: (i % 3) * 0.08, ease: EASE }}
                className="group relative overflow-hidden rounded-3xl border border-card-border bg-card p-5 md:p-7 shadow-[0_2px_20px_-12px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-[0_30px_60px_-26px_hsl(var(--brand-teal)/0.4)]"
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-flow opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-card-border bg-gradient-to-b from-white to-secondary/50 shadow-[0_12px_30px_-14px_hsl(var(--brand-teal)/0.5)] transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary/30">
                  <span className="pointer-events-none absolute inset-2 rounded-xl bg-[radial-gradient(circle_at_50%_40%,hsl(var(--brand-aqua)/0.3),transparent_70%)] opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
                  <img
                    src={c.img}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    className="h-10 w-10 object-contain drop-shadow-[0_8px_16px_hsl(var(--brand-teal)/0.4)] animate-[crystal-bob_6s_ease-in-out_infinite] motion-reduce:animate-none"
                    style={{ animationDelay: `${(i % 3) * 0.5}s` }}
                  />
                </div>
                <h3 className="font-display text-xl font-semibold tracking-tight">
                  {c.title}
                </h3>
                <p className="mt-2 text-sm font-light leading-relaxed text-muted-foreground">
                  {c.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section
        id="services"
        className="relative scroll-mt-24 py-10 md:py-28"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--brand-teal)/0.06),transparent_60%)]" />
        <div className="container relative z-10 mx-auto px-5 md:px-6">
          <motion.div {...fadeInUp} className="mx-auto mb-9 md:mb-14 max-w-2xl text-center">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Specialized Services
            </p>
            <h2 className="font-display text-3xl font-semibold tracking-tight md:text-6xl">
              More ways we{" "}
              <span className="text-gradient-flow italic">plug in.</span>
            </h2>
            <p className="mt-4 text-base md:text-lg font-light text-muted-foreground">
              Beyond full builds and training — targeted engagements for teams
              that already have momentum and need elite AI firepower on a
              specific problem.
            </p>
          </motion.div>

          <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2">
            {SERVICES.map(({ icon: Icon, title, desc, tag }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.55, delay: (i % 2) * 0.08, ease: EASE }}
                className="group relative overflow-hidden rounded-3xl border border-card-border bg-card p-5 shadow-[0_2px_20px_-12px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-[0_30px_60px_-26px_hsl(var(--brand-teal)/0.4)] md:p-8"
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-flow opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-flow text-white shadow-[0_12px_30px_-12px_hsl(var(--brand-teal)/0.7)]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-semibold tracking-tight">
                      {title}
                    </h3>
                    <p className="mt-0.5 text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-primary">
                      {tag}
                    </p>
                  </div>
                </div>
                <p className="mt-5 text-sm font-light leading-relaxed text-muted-foreground">
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeInUp} className="mt-8 md:mt-12 text-center">
            <button
              onClick={() => scrollToSection("contact")}
              className="btn-shine inline-flex items-center justify-center gap-2 rounded-full bg-gradient-flow px-7 py-3.5 text-sm font-semibold uppercase tracking-wider text-white shadow-[0_12px_30px_-10px_hsl(var(--brand-teal)/0.6)] transition-transform duration-300 hover:-translate-y-0.5"
            >
              Discuss your project
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* WHY UTK.AI */}
      <section id="why" className="relative scroll-mt-24 py-10 md:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--brand-emerald)/0.05),transparent_60%)]" />
        <div className="container relative z-10 mx-auto px-5 md:px-6">
          <motion.div {...fadeInUp} className="mx-auto mb-9 md:mb-14 max-w-2xl text-center">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Why utk.ai
            </p>
            <h2 className="font-display text-3xl font-semibold tracking-tight md:text-6xl">
              The math isn't{" "}
              <span className="text-gradient-flow italic">close.</span>
            </h2>
            <p className="mt-4 text-base md:text-lg font-light text-muted-foreground">
              Same outcome, four very different paths. Here's how building with us
              compares.
            </p>
          </motion.div>

          <motion.div {...fadeInUp} className="mx-auto max-w-5xl">
            <div className="w-full">
              <div
                role="table"
                aria-label="How building with utk.ai compares to other paths"
                className="grid grid-cols-[1.2fr_1fr_1fr_1fr_1fr] overflow-hidden rounded-2xl border border-card-border bg-card shadow-[0_20px_60px_-30px_hsl(var(--brand-teal)/0.3)] sm:rounded-3xl"
              >
                <div role="row" className="contents">
                  <div
                    role="columnheader"
                    className="min-w-0 bg-secondary/40 p-2 sm:p-4 md:p-5"
                  >
                    <span className="sr-only">Comparison criteria</span>
                  </div>
                  {COMPARE_COLUMNS.map((col, i) => (
                    <div
                      key={col}
                      role="columnheader"
                      className={`min-w-0 break-words p-2 text-center text-[0.62rem] font-semibold leading-tight sm:p-4 sm:text-sm md:p-5 ${
                        i === 0
                          ? "bg-gradient-flow text-white"
                          : "bg-secondary/40 text-muted-foreground"
                      }`}
                    >
                      {i === 0 ? (
                        <span className="font-display text-[0.72rem] sm:text-base">
                          utk.ai
                        </span>
                      ) : (
                        col
                      )}
                    </div>
                  ))}
                </div>
                {COMPARE_ROWS.map((row, r) => (
                  <div role="row" className="contents" key={row.label}>
                    <div
                      role="rowheader"
                      className={`flex min-w-0 items-center break-words p-2 text-[0.62rem] font-medium leading-tight sm:p-4 sm:text-sm md:p-5 ${
                        r % 2 ? "bg-secondary/20" : ""
                      }`}
                    >
                      {row.label}
                    </div>
                    {row.values.map((val, c) => (
                      <div
                        key={c}
                        role="cell"
                        className={`flex min-w-0 items-center justify-center break-words p-2 text-center text-[0.62rem] leading-tight sm:p-4 sm:text-sm md:p-5 ${
                          c === 0
                            ? "bg-primary/5 font-semibold text-foreground"
                            : r % 2
                              ? "bg-secondary/20 text-muted-foreground"
                              : "text-muted-foreground"
                        }`}
                      >
                        {typeof val === "boolean" ? (
                          <>
                            {val ? (
                              <Check
                                className="h-3.5 w-3.5 text-[hsl(var(--brand-emerald))] sm:h-5 sm:w-5"
                                aria-hidden="true"
                              />
                            ) : (
                              <X
                                className="h-3 w-3 text-muted-foreground/50 sm:h-4 sm:w-4"
                                aria-hidden="true"
                              />
                            )}
                            <span className="sr-only">{val ? "Yes" : "No"}</span>
                          </>
                        ) : (
                          val
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
          <p className="mt-5 px-2 text-center text-[0.7rem] text-muted-foreground/70 sm:text-xs">
            Comparison reflects typical engagements for a comparable product
            build.
          </p>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="relative scroll-mt-24 py-10 md:py-28">
        <div className="container mx-auto px-5 md:px-6">
          <motion.div
            {...fadeInUp}
            className="mb-10 md:mb-16 flex flex-col justify-between gap-4 md:gap-6 md:flex-row md:items-end"
          >
            <div className="max-w-2xl">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                Selected Work
              </p>
              <h2 className="font-display text-3xl font-semibold tracking-tight md:text-6xl">
                Shipped &{" "}
                <span className="text-gradient-flow italic">live.</span>
              </h2>
            </div>
            <p className="text-sm text-muted-foreground md:max-w-xs md:text-right">
              An arsenal of live, revenue-generating products. Real users, real
              value — and just the beginning.
            </p>
          </motion.div>

          <div className="grid gap-5 md:gap-7 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, i) => (
              <motion.a
                key={i}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.08 }}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-card-border bg-card shadow-[0_2px_20px_-12px_rgba(0,0,0,0.12)] transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-[0_30px_60px_-24px_hsl(var(--brand-teal)/0.35)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
                  {project.img ? (
                    <img
                      src={project.img}
                      alt={project.name}
                      loading="lazy"
                      className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--brand-emerald))] via-[hsl(var(--brand-teal))] to-[hsl(var(--brand-sapphire))] transition-transform duration-700 ease-out group-hover:scale-105" />
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.28),transparent_62%)]" />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,hsl(var(--brand-aqua)/0.5),transparent_55%)]" />
                      <span className="relative z-10 max-w-full break-words px-6 text-center font-display text-2xl font-semibold tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.25)]">
                        {project.name}
                      </span>
                    </div>
                  )}
                  {project.isRestricted && (
                    <div className="absolute left-4 top-4 z-20 flex items-center gap-2 rounded-full border border-primary/30 bg-white/85 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-widest text-primary backdrop-blur-md">
                      <Lock className="h-3 w-3" /> US Only
                    </div>
                  )}
                  {project.comingSoon && (
                    <div className="absolute left-4 top-4 z-20 flex items-center gap-2 rounded-full border border-primary/30 bg-white/85 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-widest text-primary backdrop-blur-md">
                      <Sparkles className="h-3 w-3" /> Coming Soon
                    </div>
                  )}
                </div>
                <div className="flex min-w-0 flex-grow flex-col items-center p-5 md:p-7 text-center">
                  <div className="mb-2 flex min-w-0 max-w-full items-center justify-center gap-1.5">
                    <h4 className="min-w-0 break-words font-display text-xl font-semibold tracking-tight transition-colors group-hover:text-primary">
                      {project.name}
                    </h4>
                    <ArrowUpRight className="h-5 w-5 -translate-x-2 text-primary opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100" />
                  </div>
                  <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-widest text-accent">
                    {project.tagline}
                  </p>
                  <p className="flex-grow text-sm font-light leading-relaxed text-muted-foreground">
                    {project.desc}
                  </p>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        id="faq"
        className="relative scroll-mt-24 border-t border-border/60 bg-secondary/30 py-10 md:py-28"
      >
        <div className="container relative z-10 mx-auto max-w-3xl px-5 md:px-6">
          <motion.div {...fadeInUp} className="mb-8 md:mb-12 text-center">
            <p className="mb-4 inline-flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              <HelpCircle className="h-3.5 w-3.5" /> FAQ
            </p>
            <h2 className="font-display text-3xl font-semibold tracking-tight md:text-6xl">
              Questions,{" "}
              <span className="text-gradient-flow italic">answered.</span>
            </h2>
          </motion.div>
          <motion.div {...fadeInUp}>
            <Accordion type="single" collapsible className="space-y-4">
              {FAQ.map((f, i) => (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className="overflow-hidden rounded-2xl border border-card-border bg-card px-6 shadow-[0_2px_20px_-14px_rgba(0,0,0,0.15)] transition-colors data-[state=open]:border-primary/30"
                >
                  <AccordionTrigger className="py-5 text-left font-display text-lg font-semibold tracking-tight hover:no-underline">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-base font-light leading-relaxed text-muted-foreground">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* CONTACT */}
      <ContactSection />

      {/* APPLY CTA */}
      <section
        id="apply"
        className="relative overflow-hidden py-14 sm:py-24 md:py-32"
      >
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={heroPoster}
            className="h-full w-full object-cover"
          >
            <source src={heroVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/70 to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent,hsl(var(--background)))]" />
        </div>
        <motion.div
          {...fadeInUp}
          className="container relative z-10 mx-auto max-w-3xl px-5 text-center md:px-6"
        >
          <h2 className="font-display text-5xl font-semibold leading-[0.95] tracking-tight md:text-8xl">
            The frontier
            <br />
            <span className="text-gradient-flow italic">awaits.</span>
          </h2>
          <p className="mx-auto mt-5 md:mt-7 max-w-xl text-xl font-light text-foreground/70 md:text-2xl">
            Spots are fiercely limited. If you have the drive to build at the
            highest level, step into the arena.
          </p>
          <div className="mt-7 md:mt-11 flex justify-center">
            <PrimaryButton
              onClick={() => openApply("internship")}
              className="px-12 py-5 text-base"
            >
              Submit Your Application
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </PrimaryButton>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border/60 bg-secondary/30 py-10 sm:py-14">
        <div className="container mx-auto flex flex-col items-center justify-between gap-5 md:gap-8 px-6 md:flex-row">
          <div className="flex flex-col items-center gap-2 md:items-start">
            <div className="font-display text-2xl font-semibold tracking-tight">
              utk<span className="text-gradient-flow">.ai</span>
            </div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              Unsloppable Tech Kickstarter · AI Venture Studio
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-5 md:gap-7 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {[
              ["internships", "Internships"],
              ["studio", "Studio"],
              ["coaching", "Coaching"],
              ["projects", "Work"],
              ["contact", "Contact"],
            ].map(([id, label]) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className="transition-colors hover:text-primary"
              >
                {label}
              </button>
            ))}
          </div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground/70">
            © {new Date().getFullYear()} utk.ai
          </div>
        </div>
      </footer>

      <AssistantWidget onApply={openApply} />
    </div>
    </MotionConfig>
  );
}
