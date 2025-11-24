export default async function handler(req, res) {
  if (req.headers["x-api-key"] !== process.env.PRIVATE_API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const shop = process.env.SHOPIFY_STORE;
  const token = process.env.SHOPIFY_TOKEN;

  try {
    const response = await fetch(
      `https://${shop}/admin/api/2024-10/products.json?limit=250`,
      {
        headers: {
          "X-Shopify-Access-Token": token,
          "Content-Type": "application/json"
        }
      }
    );

    const data = await response.json();
    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: "Error connecting to Shopify" });
  }
}