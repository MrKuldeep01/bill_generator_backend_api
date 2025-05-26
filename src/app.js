import express from "express";
import cors from "cors";
import config from "../config/config.js";
import cookieParser from "cookie-parser";
const app = express();
app.use(
  cors({
    origin: config.corsOrigin
  })
);
app.use(cookieParser());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "16kb" }));
import { routeVersion } from "./constant.js";
import homeRouters from './routes/home.routes.js'
import authRouters from "./routes/auth.routes.js"
import testRouters from "./routes/test.routes.js"
app.use(`/${routeVersion}`, homeRouters)
app.use(`/test`,testRouters)
app.use(`/${routeVersion}/auth`, authRouters)

app.on("error", (error) => {
  console.error(`Error occured in application :- ${error}`);
  process.exit(1);
});

export default app;
