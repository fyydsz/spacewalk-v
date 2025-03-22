import { Router } from "express";
import helloHandler from "../v1/hello";

const router = Router();

router.get("/hello", helloHandler);

export default router;