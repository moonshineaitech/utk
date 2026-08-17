import { Router, type IRouter, type Request, type Response } from "express";
import {
  VerifyAssistantTurnstileBody,
  SendAssistantMessageBody,
} from "@workspace/api-zod";
import {
  getClientIp,
  getTurnstileSiteKey,
  verifyTurnstileToken,
  issueChatPass,
  verifyChatPass,
  reserveAssistantUsage,
  releaseAssistantUsage,
  generateAssistantReply,
} from "../lib/assistant";

const router: IRouter = Router();

router.get("/assistant/config", (_req: Request, res: Response) => {
  res.json({ turnstileSiteKey: getTurnstileSiteKey() ?? "" });
});

router.post("/assistant/verify", async (req: Request, res: Response) => {
  const parsed = VerifyAssistantTurnstileBody.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
    return;
  }

  const ip = getClientIp(req);
  const ok = await verifyTurnstileToken(parsed.data.token, ip);
  if (!ok) {
    res
      .status(403)
      .json({ error: "Human verification failed. Please try again." });
    return;
  }

  const { pass, expiresAt } = issueChatPass(ip);
  res.json({ pass, expiresAt });
});

router.post("/assistant/chat", async (req: Request, res: Response) => {
  const parsed = SendAssistantMessageBody.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
    return;
  }

  const ip = getClientIp(req);
  if (!verifyChatPass(parsed.data.pass, ip)) {
    res.status(401).json({
      error: "Verification expired. Please complete the human check again.",
    });
    return;
  }

  const reservation = await reserveAssistantUsage(ip);
  if (!reservation.ok) {
    res.status(429).json({
      error:
        reservation.reason === "global_daily"
          ? "The assistant is busy right now. Please try again later, or use the apply form."
          : "You've reached the message limit for now. Please try again later.",
    });
    return;
  }

  try {
    const reply = await generateAssistantReply(parsed.data.messages);
    if (!reply) {
      await releaseAssistantUsage(reservation.usageId);
      res.status(502).json({
        error: "The assistant could not generate a reply. Please try again.",
      });
      return;
    }
    res.json({ reply });
  } catch (err) {
    await releaseAssistantUsage(reservation.usageId);
    req.log.error({ err }, "Assistant chat failed");
    res.status(502).json({
      error: "The assistant is unavailable right now. Please try again shortly.",
    });
  }
});

export default router;
