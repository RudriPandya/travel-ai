import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import dashboardRouter from "./dashboard.js";
import tripsRouter from "./trips.js";
import aiRouter from "./ai.js";
import flightsRouter from "./flights.js";
import hotelsRouter from "./hotels.js";
import activitiesRouter from "./activities.js";
import destinationsRouter from "./destinations.js";
import bookingsRouter from "./bookings.js";
import expensesRouter from "./expenses.js";
import profileRouter from "./profile.js";
import loyaltyRouter from "./loyalty.js";
import alertsRouter from "./alerts.js";
import corporateRouter from "./corporate.js";
import notificationsRouter from "./notifications.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(dashboardRouter);
router.use(tripsRouter);
router.use(aiRouter);
router.use(flightsRouter);
router.use(hotelsRouter);
router.use(activitiesRouter);
router.use(destinationsRouter);
router.use(bookingsRouter);
router.use(expensesRouter);
router.use(profileRouter);
router.use(loyaltyRouter);
router.use(alertsRouter);
router.use(corporateRouter);
router.use(notificationsRouter);

export default router;
