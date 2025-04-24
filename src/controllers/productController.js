import { fetchOpenAIProductInfo } from "../services/openaiService.js";

export const parseProductController = async (req, res) => {
  const { openaiApiKey, url } = req.body;

  if (!openaiApiKey || !url) {
    return res.status(400).json({ error: "API key and URL are required." });
  }

  try {
    const result = await fetchOpenAIProductInfo(openaiApiKey, url);
    res.status(200).json(result ); 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
