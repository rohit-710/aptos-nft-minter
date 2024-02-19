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
    const data = req.body; // Your webhook payload

    // Trigger an event to your channel with the webhook data
    await pusher.trigger("aptos-nft-minter-channel", "webhook-event", data);

    res.status(200).json({ message: "Webhook data received and broadcasted" });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end("Method Not Allowed");
  }
  console.log({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER,
  });
}
