// Inside /api/mint-nft.js
const axios = require(`axios`);

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send({ error: "Method not allowed" });
  }

  try {
    const response = await axios.post(
      `https://staging.crossmint.com/api/2022-06-09/collections/${process.env.COLLECTION_ID}/nfts`,
      req.body,
      {
        headers: {
          "X-API-KEY": process.env.API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error forwarding the request." });
  }
};
