// app.js
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import totpUtilsRouter from "./routes/totpUtils.js";

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "welcome to utils API!" });
});

// Define your routes
app.use("/totp-utils", totpUtilsRouter);

export default app;
