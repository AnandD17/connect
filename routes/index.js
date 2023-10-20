import express from "express"
const router = express.Router()

import dataRoutes from "./dataRoutes.js"

router.get("/", (req, res) => {
    res.send("API is running...");
});


router.use("/api/v1/data", dataRoutes)

export default router;