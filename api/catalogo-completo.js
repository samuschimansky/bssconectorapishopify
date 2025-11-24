// api/catalogo-completo.js
export default async function handler(req, res) {
  if (req.headers["x-api-key"] !== process.env.PRIVATE_API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const shop = process.env.SHOPIFY_STORE;
  const token = process.env.SHOPIFY_TOKEN;

  try {
    const response = await fetch(
      `https://${shop}/admin/api/2024-10/products.json?limit=250&fields=id,title,body_html,variants,images,tags,options,product_type,vendor,handle`,
      {
        headers: {
          "X-Shopify-Access-Token": token,
          "Content-Type": "application/json"
        }
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error("Shopify error:", response.status, text);
      return res.status(500).json({
        error: "Error al conectar con Shopify",
        status: response.status,
        detail: text
      });
    }

    const data = await response.json();

    // Añadimos enlace directo por producto
    const productos = data.products.map(p => ({
      ...p,
      url: `https://${shop}/products/${p.handle}`
    }));

    return res.status(200).json({ products: productos });

  } catch (err) {
    console.error("API error:", err);
    return res.status(500).json({ error: "Error interno", detail: err.toString() });
  }
}
