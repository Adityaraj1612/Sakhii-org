import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/ask", async (req, res) => {
  try {
    const { userQuery } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });
    const result = await model.generateContent(userQuery);
    const reply = result.response.text();
    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
