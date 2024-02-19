import React, { useState, useEffect } from "react";
import "./App.css";
import logo from "./AptosCover.png";
import Pusher from "pusher-js";

function App() {
  const [apiResponse, setApiResponse] = useState(null);
  const [sseMessages, setSseMessages] = useState([]); // State to store SSE messages
  const [updates, setUpdates] = useState([]);
  const [webhookData, setWebhookData] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    recipient: "",
  });

  // Function to handle form data changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Function to fetch updates from your API
  const fetchUpdates = async () => {
    try {
      const response = await fetch("/api/updates"); // Adjust the URL as needed
      const data = await response.json();
      setUpdates(data); // Update your state with the new updates
    } catch (error) {
      console.error("Failed to fetch updates:", error);
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const proxyUrl = "/api/mint-nft";

    try {
      const response = await fetch(proxyUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          metadata: {
            description: formData.description,
            image: formData.image,
            name: formData.name,
          },
          recipient: `aptos:${formData.recipient}`,
        }),
      });

      const responseData = await response.json();
      console.log(responseData);
      setApiResponse(responseData); // Update the state with the API response
      alert("Minting Successful! Check the response below.");
    } catch (err) {
      console.error(err);
      alert("An error occurred. Check the console for details.");
    }
  };

  useEffect(() => {
    const pusher = new Pusher(process.env.REACT_APP_KEY, {
      cluster: process.env.REACT_APP_CLUSTER,
      encrypted: true,
    });

    const channel = pusher.subscribe("aptos-nft-minter");
    channel.bind("nft-event", function (data) {
      // Assuming 'data' is the entire payload
      setWebhookData((prevData) => [...prevData, data]);
    });

    return () => {
      pusher.unsubscribe("aptos-nft-minter");
    };
  }, []);

  return (
    <div className="App">
      <form onSubmit={handleSubmit} className="form">
        <img
          src={logo}
          alt="Crossmint Ninja"
          className="nft-logo"
          width="200"
          height="200"
        />
        <h1 style={{ color: "#1ABC9C" }}>Mint Your NFT</h1>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={formData.image}
          onChange={handleChange}
        />
        <input
          type="text"
          name="recipient"
          placeholder="Recipient Address"
          value={formData.recipient}
          onChange={handleChange}
        />
        <button type="submit">Mint NFT</button>
      </form>
      {/* Display API response */}
      {apiResponse && (
        <div className="response">
          <h2>API Response:</h2>
          <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
        </div>
      )}
      {/* Display SSE messages */}
      <div className="sse-messages">
        <h2>Webhook Data:</h2>
        {webhookData.map((dataItem, index) => (
          <pre key={index}>{JSON.stringify(dataItem)}</pre>
        ))}
      </div>
    </div>
  );
}

export default App;
