import { pushUpdate } from "./events";

export default function handler(req, res) {
  if (req.method === "POST") {
    // Assuming the body of the webhook event contains the type and data
    const { type, data } = req.body;
    console.log(`Received webhook - Type: ${type}`, data);

    // TODO: Process your webhook data here. For real-time updates, you might
    // store this in a database or in-memory storage that your SSE endpoint will poll.

    res.status(200).json({ message: "Webhook received" });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  pushUpdate({ type: "webhookReceived", data: req.body });
}
