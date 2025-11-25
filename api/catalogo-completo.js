export default async function handler(req, res) {
  if (req.headers["x-api-key"] !== process.env.PRIVATE_API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const shop = process.env.SHOPIFY_STORE;
  const token = process.env.SHOPIFY_TOKEN;

  try {
    const response = await fetch(
      `https://${shop}/admin/api/2024-10/products.json?limit=250&fields=id,title,variants,images,handle,vendor,product_type,tags,options`,
      {
        headers: {
          "X-Shopify-Access-Token": token,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    const productos = data.products.map((p) => {
      return {
        id: p.id,
        titulo: p.title,
        url: `https://bikeshopsolutions.es/products/${p.handle}`,
        vendor: p.vendor,
        tipo: p.product_type,
        variantes: p.variants?.map((v) => ({
          id: v.id,
          sku: v.sku,
          precio: v.price,
          disponible: v.available,
        })),
      };
    });

    return res.status(200).json({ products: productos });
  } catch (err) {
    console.error("API error:", err);
    return res.status(500).json({ error: "Error interno", detail: err.toString() });
  }
}

