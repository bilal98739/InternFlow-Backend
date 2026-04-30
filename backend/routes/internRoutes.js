import express from "express";
import auth from "../middleware/auth.js";
import {
    getInterns, getIntern, createIntern, updateIntern, deleteIntern
} from "../controllers/internController.js";

const router = express.Router();

router.get("/",        auth, getInterns);
router.get("/:id",     auth, getIntern);
router.post("/",       auth, createIntern);
router.put("/:id",     auth, updateIntern);
router.delete("/:id",  auth, deleteIntern);

export default router;
