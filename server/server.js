require("dotenv").config(); // Ensure you install dotenv to use this
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();

const PORT = process.env.PORT || 3001;

// Middleware to enable CORS and JSON body parsing
app.use(cors());
app.use(express.json());

// Proxy endpoint
app.post("/api/mint-nft", async (req, res) => {
  // Construct the API URL from environment variables or directly
  const apiUrl = `https://staging.crossmint.com/api/2022-06-09/collections/${process.env.COLLECTION_ID}/nfts`;

  try {
    // Forward the request to the Crossmint API
    const response = await axios.post(apiUrl, req.body, {
      headers: {
        "X-API-KEY": process.env.API_KEY,
        "Content-Type": "application/json",
      },
    });
    // Send back the response from Crossmint API to the client
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(error.response?.status || 500).json({
      message: "Error forwarding the request to Crossmint API",
      error: error.message,
      details: error.response?.data || null,
    });
    console.log(process.env.COLLECTION_ID);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
