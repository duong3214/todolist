import { Router } from "express";
import * as tasksController from "../controllers/tasksController";

const router = Router();

router.get("/:userId", tasksController.getTasks);
router.post("/:userId", tasksController.createTask);
router.put("/:userId/:taskId", tasksController.updateTask);
router.delete("/:userId/:taskId", tasksController.deleteTask);

export default router;
