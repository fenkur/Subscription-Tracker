import { Router } from "express";
import { sendReminders } from "../controllers/workflow.controller.js";

const workflowRouter = new Router();

workflowRouter.post('/subscription/reminder', sendReminders);

export default workflowRouter;