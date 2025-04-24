# Open-AI Server

## Deployed API URL

**API URL**: [https://open-ai-extract-product.onrender.com](https://open-ai-extract-product.onrender.com)

---

## Sample Request & Response

### Sample Request

**Endpoint**: `POST /api/parse-product`

**Request Body**:

```json
{
  "apiKey": "your-openai-api-key",
  "url": "https://example.com/product-page"
}
```

### Sample Response

**Response Body**:

```json
{
  "url": "https://example.com/product-page",
  "title": " Product Title",
  "category": "Product category",
  "subcategory": "Product subcategory",
  "attributes": {
    "dynamic attributes key": ["attributes value"],
  },
  "rawPrice":
}
```

---

## Local Run Instructions

1. Clone the repository:

   ```bash
   git clone https://github.com/dipeshpawar118/open-ai-extract-product
   cd open-ai-server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. The server will start at `http://localhost:3000`.

---

## Description

### Prompt

The prompt is designed to extract structured product information from raw e-commerce page content. It instructs the OpenAI model to identify key details such as the product title, category, subcategory, attributes (e.g., color, size), and price.

### Parsing Strategy

1. **HTML Parsing**: The `extractTextFromDivs` function uses `cheerio` to scrape and clean the HTML content of the provided URL.
2. **Prompt Construction**: The cleaned text is passed into a structured prompt for the OpenAI GPT model.
3. **Response Parsing**: The response is cleaned and parsed as JSON to ensure the output is structured and usable.

### Schema Design

The output schema is dynamic and adapts to the product type. It includes:

- `title`: The product's title.
- `category`: The main category of the product.
- `subcategory`: A more specific subcategory.
- `attributes`: A key-value pair of dynamic attributes (e.g., color, size).
- `rawPrice`: The numeric price of the product.
- `url`: The original URL of the product page.

---

## Tradeoffs or TODOs

### Tradeoffs

- **Token Limit**: The prompt and response are limited by the OpenAI token limit, which may truncate large product descriptions.
- **Dynamic Attributes**: The attributes are extracted dynamically, which may result in missing or incomplete data for complex product pages.

### TODOs

1. **Error Handling**: Improve error handling for edge cases, such as invalid HTML structures or unexpected API responses.
2. **Pagination**: Add support for multi-page product details.
3. **Testing**: Add unit and integration tests for better reliability.
4. **Performance**: Optimize the HTML parsing and reduce unnecessary data extraction to improve performance.
5. **Deployment**: Automate deployment pipelines for easier updates.
