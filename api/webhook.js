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
    let message;

    // Handle the nfts.create.succeeded event
    if (req.body.type === "nfts.create.succeeded") {
      message = `[webhook] Successfully minted NFT with ID ${req.body.data.token.id}`;
      console.log(message);
    }
    // Handle the nfts.create.failed event
    else if (req.body.type === "nfts.create.failed") {
      message = `[webhook] Failed to mint NFT with action ID ${req.body.actionId}`;
      console.log(message);
    }

    // Use Pusher to broadcast this message to your frontend
    if (message) {
      await pusher.trigger("nft-channel", "nft-event", {
        message,
      });
    }

    res.status(200).json({ message: "Webhook processed" });
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
