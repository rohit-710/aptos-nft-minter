// This might be in another file like /api/webhook.js
import { pushUpdate } from "./events"; // Note: Direct imports like this don't work in Vercel's serverless functions for separate files

export default async function webhookHandler(req, res) {
  if (req.method === "POST") {
    // Process the incoming webhook data
    const data = req.body; // Assuming JSON input

    // Here, you would validate the data and possibly filter or transform it
    console.log("Webhook received:", data);

    // Push the update to all connected SSE clients
    pushUpdate(data);

    res.status(200).json({ message: "Webhook processed and broadcasted" });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
