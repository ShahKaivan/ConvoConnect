// import express from 'express'
// import axios from 'axios' // calls API
// import dotenv from "dotenv"
// import { openai } from "../index.js"

// dotenv.config();
// const router = express.Router();

// router.post("/text", async (req, res) => {
//     try{
//         const { text, activeChatId} = req.body;
//         console.log("req.body",req.body);
        
//         const response = await openai.chat.completions.create({
//             model: "text-davinci-003",
//             prompt: text,
//             temperature: 0.5,
//             max_tokens: 2048,
//             top_p: 1,
//             frequency_penalty: 0.5,
//             presence_penalty: 0,
//         })
//         console.log('response data', response.data)

//         await axios.post(
//             `https://api.chatengine.io/chats/${activeChatId}/messages`,
//             {text: response.data.choices[0].text},
//             {
//                 headers: {
//                     "Project-ID": process.env.PROJECT_ID,
//                     "User-Name": process.env.BOT_USER_NAME,
//                     "User-Secret": process.env.BOT_USER_SECRET,
//                 }
//             }
//         )

//         res.status(200).json({ text });
//     }catch(error){
//         console.log("error",error);
//         res.status(500).json({ error: error.message});
//     }
// })

// export default router;

/* 
  NOTE: replace the openai.js file with this file and uncomment 
  the code if you want to use the newer version of the openai API.
  OPENAI released their gpt-3.5-turbo version on 3/1/2023, this is
  gpt-3.5 version which is what powers the ChatGPT bot. most of the
  code is the same with some minor changes.
*/

// import express from "express";
// import axios from "axios";
// import dotenv from "dotenv";
// import { openai } from "../index.js";

// dotenv.config();
// const router = express.Router();

// router.post("/text", async (req, res) => {
//   try {
//     const { text, activeChatId } = req.body;

//     const response = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [
//         { role: "system", content: "You are a helpful assistant." }, // this represents the bot and what role they will assume
//         { role: "user", content: text }, // the message that the user sends

//         // BONUS NOTE: you can also provide a list of messages to the bot to give context
//         // and the bot can use that information to respond to the user as needed, ie adding:
//         // { role: "assistant", content: "The weather sucks today." },

//         // to the above messages array, and then asking it this question:
//         // `how is the weather today?`

//         // the bot gave me this response:
//         // `I apologize for my previous response. As an AI language model, I should not use such language.
//         // I do not have access to real-time weather information without your location. Could you please
//         // let me know your location, so I can provide you with accurate weather information?`

//         // Hence, if you wanted to keep the "threads" that exist on ChatGPT, you would have to save the
//         // messages that the bot sends and then provide them to the bot in the next request.
//       ],
//     });

//     await axios.post(
//       `https://api.chatengine.io/chats/${activeChatId}/messages/`,
//       { text: response.data.choices[0].message.content },
//       {
//         headers: {
//           "Project-ID": process.env.PROJECT_ID,
//           "User-Name": process.env.BOT_USER_NAME,
//           "User-Secret": process.env.BOT_USER_SECRET,
//         },
//       }
//     );

//     res.status(200).json({ text: response.data.choices[0].message.content });
//   } catch (error) {
//     console.error("error", error);
//     res.status(500).json({ error: error.message });
//   }
// });

// router.post("/code", async (req, res) => {
//   try {
//     const { text, activeChatId } = req.body;

//     const response = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [
//         {
//           role: "system",
//           content:
//             "You are an assistant coder who responds with only code and no explanations.",
//         }, // this represents the bot and what role they will assume
//         { role: "user", content: text }, // the message that the user sends
//       ],
//     });

//     await axios.post(
//       `https://api.chatengine.io/chats/${activeChatId}/messages/`,
//       { text: response.data.choices[0].message.content },
//       {
//         headers: {
//           "Project-ID": process.env.PROJECT_ID,
//           "User-Name": process.env.BOT_USER_NAME,
//           "User-Secret": process.env.BOT_USER_SECRET,
//         },
//       }
//     );

//     res.status(200).json({ text: response.data.choices[0].message.content });
//   } catch (error) {
//     console.error("error", error);
//     res.status(500).json({ error: error.message });
//   }
// });

// router.post("/assist", async (req, res) => {
//   try {
//     const { text } = req.body;

//     const response = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [
//         {
//           role: "system",
//           content:
//             "You are a helpful assistant that serves to only complete user's thoughts or sentences.",
//         }, // this represents the bot and what role they will assume
//         { role: "user", content: `Finish my thought: ${text}` }, // the message that the user sends
//       ],
//     });

//     res.status(200).json({ text: response.data.choices[0].message.content });
//   } catch (error) {
//     console.error("error", error);
//     res.status(500).json({ error: error.message });
//   }
// });

// export default router;

import express from "express";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/text", async (req, res) => {
  try {
    const { text, activeChatId } = req.body;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
    });

    const prompt = text; // Assuming 'text' is directly the prompt

    const result = await model.generateContent([prompt]);
    const generatedText = result.response.text();
    // console.log(generatedText)

    await axios.post(
      `https://api.chatengine.io/chats/${activeChatId}/messages/`,
      { text: generatedText },
      {
        headers: {
          "Project-ID": process.env.PROJECT_ID,
          "User-Name": process.env.BOT_USER_NAME,
          "User-Secret": process.env.BOT_USER_SECRET,
        },
      }
    );

    res.status(200).json({ text: generatedText });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/code", async (req, res) => {
  try {
    const { text, activeChatId } = req.body;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
    });

    const prompt = text; // Assuming 'text' is directly the prompt

    const result = await model.generateContent([prompt]);
    const generatedCode = result.response.text();

    await axios.post(
      `https://api.chatengine.io/chats/${activeChatId}/messages/`,
      { text: generatedCode },
      {
        headers: {
          "Project-ID": process.env.PROJECT_ID,
          "User-Name": process.env.BOT_USER_NAME,
          "User-Secret": process.env.BOT_USER_SECRET,
        },
      }
    );

    res.status(200).json({ text: generatedCode });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/assist", async (req, res) => {
  try {
    const { text } = req.body;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
    });

    const prompt = `Finish my thought: ${text}`;

    const result = await model.generateContent([prompt]);
    const generatedResponse = result.response.text();

    res.status(200).json({ text: generatedResponse });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
