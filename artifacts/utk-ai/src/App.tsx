import { useEffect, useRef } from "react";
import {
  ClerkProvider,
  SignIn,
  SignUp,
  Show,
  useClerk,
} from "@clerk/react";
import { publishableKeyFromHost } from "@clerk/react/internal";
import { shadcn } from "@clerk/themes";
import {
  Switch,
  Route,
  Redirect,
  useLocation,
  Router as WouterRouter,
} from "wouter";
import { QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/home";
import Portal from "@/pages/portal";
import Admin from "@/pages/admin";
import NotFound from "@/pages/not-found";

// REQUIRED — copy verbatim. Resolves the key from window.location.hostname.
const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);

// REQUIRED — copy verbatim. Empty in dev, auto-set in prod.
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

if (!clerkPubKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY in .env file");
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: "clerk",
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
    socialButtonsPlacement: "bottom" as const,
    socialButtonsVariant: "blockButton" as const,
  },
  variables: {
    colorPrimary: "#0B97A9",
    colorForeground: "#0A1A1F",
    colorMutedForeground: "#5A7077",
    colorDanger: "#E5484D",
    colorBackground: "#FFFFFF",
    colorInput: "#FFFFFF",
    colorInputForeground: "#0A1A1F",
    colorNeutral: "#0A1A1F",
    fontFamily: "'Inter', sans-serif",
    borderRadius: "1rem",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox:
      "bg-white border border-[#DCEAEC] rounded-3xl w-full max-w-full overflow-hidden shadow-[0_30px_80px_-30px_rgba(11,151,169,0.35)]",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
    headerTitle: "text-[#0A1A1F] text-2xl font-bold tracking-tight",
    headerSubtitle: "text-[#5A7077]",
    socialButtonsBlockButton:
      "bg-[#F4FAFB] border border-[#DCEAEC] hover:bg-[#E9F5F6] transition-colors",
    socialButtonsBlockButtonText: "text-[#0A1A1F] font-medium",
    dividerLine: "bg-[#DCEAEC]",
    dividerText: "text-[#5A7077]",
    formFieldLabel: "text-[#274047] font-medium",
    formFieldInput:
      "bg-white border border-[#DCEAEC] text-[#0A1A1F] focus:border-[#0B97A9]",
    formButtonPrimary:
      "bg-[#0B97A9] hover:bg-[#0A8494] text-white font-semibold normal-case",
    footerActionText: "text-[#5A7077]",
    footerActionLink: "text-[#0B97A9] hover:text-[#13B0A0] font-medium",
    identityPreviewEditButton: "text-[#0B97A9]",
    formFieldSuccessText: "text-[#11A37C]",
    formFieldErrorText: "text-[#E5484D]",
    alertText: "text-[#0A1A1F]",
    otpCodeFieldInput: "text-[#0A1A1F] border-[#DCEAEC]",
    logoImage: "h-10 w-auto",
    logoBox: "h-10",
    main: "gap-5",
  },
};

function AuthBackdrop({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-background px-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--brand-aqua)/0.14),transparent_55%)]" />
      <div className="pointer-events-none absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-[hsl(var(--brand-teal)/0.18)] blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 bottom-1/4 h-96 w-96 rounded-full bg-[hsl(var(--brand-emerald)/0.16)] blur-[120px]" />
      <div className="relative z-10 w-full max-w-[440px]">{children}</div>
    </div>
  );
}

function SignInPage() {
  return (
    <AuthBackdrop>
      <SignIn
        routing="path"
        path={`${basePath}/sign-in`}
        signUpUrl={`${basePath}/sign-up`}
      />
    </AuthBackdrop>
  );
}

function SignUpPage() {
  return (
    <AuthBackdrop>
      <SignUp
        routing="path"
        path={`${basePath}/sign-up`}
        signInUrl={`${basePath}/sign-in`}
      />
    </AuthBackdrop>
  );
}

function ProtectedPortal() {
  return (
    <>
      <Show when="signed-in">
        <Portal />
      </Show>
      <Show when="signed-out">
        <Redirect to="/" />
      </Show>
    </>
  );
}

function ProtectedAdmin() {
  return (
    <>
      <Show when="signed-in">
        <Admin />
      </Show>
      <Show when="signed-out">
        <Redirect to="/" />
      </Show>
    </>
  );
}

// Invalidate the query cache when the signed-in user changes.
function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const qc = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (
        prevUserIdRef.current !== undefined &&
        prevUserIdRef.current !== userId
      ) {
        qc.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, qc]);

  return null;
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      localization={{
        signIn: {
          start: {
            title: "Welcome back",
            subtitle: "Sign in to your utk.ai command center",
          },
        },
        signUp: {
          start: {
            title: "Join utk.ai",
            subtitle: "Create your account to apply and track your status",
          },
        },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        <TooltipProvider>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/sign-in/*?" component={SignInPage} />
            <Route path="/sign-up/*?" component={SignUpPage} />
            <Route path="/portal" component={ProtectedPortal} />
            <Route path="/admin" component={ProtectedAdmin} />
            <Route component={NotFound} />
          </Switch>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  );
}

export default App;
