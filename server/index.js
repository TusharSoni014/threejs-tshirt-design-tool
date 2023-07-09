import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";

import dalleRoutes from "./routes/dalle.routes.js";
import { Configuration, OpenAIApi } from "openai";

dotenv.config(); //to configure dotenv
const app = express();

//middlewares
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use("/api/v1/dalle", dalleRoutes);


app.listen(4000, () => {
  console.log("https://localhost:4000");
});
