import { Router, type IRouter, type Response } from "express";
import { requireAuth, type AuthedRequest } from "../lib/auth";

const router: IRouter = Router();

router.get("/me", requireAuth(), (req: AuthedRequest, res: Response) => {
  res.json(req.authUser);
});

export default router;
