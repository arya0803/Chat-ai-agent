import * as ai from "../services/ai.service.js";

export const getResult = async (req, res) => {
  try {
    const { prompt } = req.query;

    if (!prompt) {
      return res.status(400).json({ success: false, message: "Prompt is required" });
    }

    const result = await ai.generateResult(prompt);

    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
