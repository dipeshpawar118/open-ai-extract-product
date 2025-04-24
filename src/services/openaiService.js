import OpenAI from "openai";
import axios from "axios";
import * as cheerio from "cheerio";

export const fetchOpenAIProductInfo = async (apiKey, url) => {
  try {
    // Validate the URL
    if (!isValidUrl(url)) {
      throw new Error("Invalid URL provided.");
    }

    // Validate the OpenAI API key
    if (!apiKey || typeof apiKey !== "string") {
      throw new Error("Invalid OpenAI API key provided.");
    }

    const openai = new OpenAI({ apiKey });

    let text = await extractTextFromDivs(url); // Extract text from divs

    const prompt = `You are an intelligent data extractor that converts raw e-commerce product page content into structured JSON.

Instructions:
- Analyze the text below.
- Detect the product's title, category/type, price, and any relevant attributes (like color, size, material, etc.).
- Attributes should be dynamic and vary depending on the product type.

{
  "title": "<product title>",
  "category": "<product type/category>",
  "subcategory": "<product sub type/subcategory>",
  "attributes": {
    "<attributeName>": [<attributeValues>],
    ...
  },
  "rawPrice": <numeric price>
}

Guidelines:
- Keep it dynamic and adapt to any product type.
- Include only attributes found in the content.
- Use camelCase for all attribute keys.

Content:
${text}
`;

    // Step 2: Call GPT-4 to extract product info
    const gptResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.5,
      max_tokens: 2000, 
    });

    // Extract the token usage from the response
    const tokenUsage = gptResponse.usage;
    const totalTokensUsed = tokenUsage.total_tokens;

    console.log(`Total tokens used: ${totalTokensUsed}`);

    let responseContent = gptResponse.choices[0].message.content;
    const cleanString = responseContent
      .replace(/^```json\n/, "")
      .replace(/```$/, "");

    // Parse the cleaned string
    const parsedObject = JSON.parse(cleanString);
    parsedObject["url"] = url; // Add the URL to the parsed object
    return parsedObject;
  } catch (error) {
    console.error("Error in fetchOpenAIProductInfo:", error.message);
    throw new Error(error.message);
  }
};

async function extractTextFromDivs(url) {
  try {
    // Fetch the HTML content from the provided URL
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);

    let resultText = "";

    // Extract the title from the <title> tag
    const title = $("title").text().trim();
    if (title) {
      resultText += `Title: ${title}\n\n`;
    }

    // Extract the description from the <meta name="description"> tag
    const description = $('meta[name="description"]').attr("content");
    if (description) {
      resultText += `Description: ${description}\n\n`;
    }

    // Extract any other useful meta information (e.g., keywords, author)
    const keywords = $('meta[name="keywords"]').attr("content");
    const author = $('meta[name="author"]').attr("content");

    if (keywords) {
      resultText += `Keywords: ${keywords} \n\n`;
    }

    if (author) {
      resultText += `Author: ${author} \n\n`;
    }

    // Remove unwanted elements like <header> and <footer>
    $("header, footer").remove();

    // Loop through all div elements and extract their text content
    $("div").each((index, div) => {
      // Remove unwanted elements (like <img>, <a>, <script>, <style>)
      $(div).find("img, a, script, style").remove();

      // Extract the cleaned text content from the div
      let textContent = $(div).text().trim();

      // Filter out non-alphanumeric characters and only keep numbers and letters
      textContent = textContent.replace(/[^a-zA-Z0-9\s]/g, "");

      // If there's any text content, add it to the result
      if (textContent) {
        resultText += textContent.trim() + " ";
      }
    });

    let str = resultText.trim(); // Return the cleaned text content
    if (str.length <= 12000) {
      return str;
    } else {
      return str.substring(0, 12000);
    }
  } catch (error) {
    console.error("Error fetching or parsing HTML:", error.message);
    throw new Error("Failed to fetch or parse HTML content.");
  }
}

// Helper function to validate URLs
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}
