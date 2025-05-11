import express from "express";
import cors from "cors";
import config from "../config/config.js";
import cookieParser from "cookie-parser";
const app = express();
app.use(
  cors({
    origin: config.corsOrigin,
    Credential: true,
  })
);
app.use(cookieParser());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "16kb" }));
import { routeVersion } from "./constent.js";
import homeRouters from './routes/home.routes.js'
app.use(`${routeVersion}/`, homeRouters)

app.on("error", (error) => {
  console.error(`Error occured in application :- ${error}`);
  process.exit(1);
});

export default app;
