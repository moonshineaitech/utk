import { Router, type IRouter } from "express";
import healthRouter from "./health";
import usersRouter from "./users";
import applicationsRouter from "./applications";
import adminRouter from "./admin";
import assistantRouter from "./assistant";
import contactRouter from "./contact";

const router: IRouter = Router();

router.use(healthRouter);
router.use(usersRouter);
router.use(applicationsRouter);
router.use(adminRouter);
router.use(assistantRouter);
router.use(contactRouter);

export default router;
