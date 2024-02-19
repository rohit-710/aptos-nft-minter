let connections = [];

export default function handler(req, res) {
  // Set headers for SSE
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  // Function to send a test message immediately upon connection
  const sendTestMessage = () => {
    res.write(
      `data: ${JSON.stringify({
        message: "Connection established",
        timestamp: new Date(),
      })}\n\n`
    );
  };

  // Add the current connection to the list of connections
  connections.push(res);
  sendTestMessage(); // Send a test message to confirm connection

  // Handle connection close
  req.on("close", () => {
    connections = connections.filter((conn) => conn !== res);
  });
}

// Function to push updates to all connected clients
export function pushUpdate(data) {
  connections.forEach((conn) => {
    conn.write(`data: ${JSON.stringify(data)}\n\n`);
  });
}
