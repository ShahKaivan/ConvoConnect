// import express from "express"
// import bodyParser from "body-parser"
// import cors from "cors"
// import dotenv from "dotenv"
// import helmet from "helmet"
// import morgan from "morgan"
// // import {Configuration,OpenAIApi} from "openai";
// import OpenAI from 'openai';
// import openAiRoutes from "./routes/openai.js"

// // CONFIGURATION
// dotenv.config();
// const app = express();
// app.use(express.json());
// app.use(helmet());
// app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}))
// app.use(morgan("common"));
// app.use(bodyParser.json({limit: "30mb", extended: true}))
// app.use(bodyParser.urlencoded({limit: "30mb", extended: true}))
// app.use(cors());

// // OPEN AI CONFIGURATION

// // const configuration = new Configuration({
// //     apiKey: process.env.OPEN_API_KEY, // This is the default and can be omitted
// //   });

// // export const openai = new OpenAIApi(configuration);

// const openai = new OpenAI({
//   apiKey: process.env['OPEN_API_KEY'], // This is the default and can be omitted
// });
// export {openai};

// //ROUTES
// app.use('/openai', openAiRoutes);

// // SERVER SETUP
// const PORT = process.env.PORT || 9000;
// app.listen(PORT, () => {
//     console.log(`Example app listening at http://localhost:${PORT}`);
// });

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
// import { GenAI } from "genai"; // Assuming GenAI is the library for Gemini API
import {GoogleGenerativeAI} from "@google/generative-ai"
import openAiRoutes from "./routes/openai.js";
import authRoutes from "./routes/auth.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// GenAI Configuration
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Routes
app.use("/openai", openAiRoutes);
app.use("/auth", authRoutes);

// SERVER SETUP
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
