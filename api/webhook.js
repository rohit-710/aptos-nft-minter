// Import Pusher
const Pusher = require("pusher");

// Initialize Pusher with your app credentials
const pusher = new Pusher({
  appId: process.env.API_ID,
  key: process.env.KEY,
  secret: process.env.SECRET,
  cluster: process.env.CLUSTER,
  useTLS: true,
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    // Directly use the received JSON payload
    const payload = req.body;

    // Use Pusher to broadcast this payload to your frontend
    await pusher.trigger("aptos-nft-minter", "nft-event", payload);

    res.status(200).json({ message: "Webhook processed" });
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
