import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "16kb" }));
import homeRouters from './routes/home.routes.js'
import authRouters from "./routes/auth.routes.js"
app.use(`/api/v1`, homeRouters)
app.use(`/api/v1/auth`, authRouters)

app.on("error", (error) => {
  console.error(`Error occured in application :- ${error}`);
  process.exit(1);
});

export default app;
