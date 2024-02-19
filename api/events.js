let connections = [];

export default function handler(req, res) {
  req.socket.setTimeout(0);
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Add this connection to our list of connections
  connections.push(res);

  req.on("close", () => {
    // Remove this connection from the array when it closes
    connections = connections.filter((conn) => conn !== res);
  });
}

// Function to call to push updates to clients
export function pushUpdate(data) {
  connections.forEach((conn) => {
    conn.write(`data: ${JSON.stringify(data)}\n\n`);
  });
}
