import React, { useState, useEffect } from "react";
import "./App.css";
import logo from "./AptosCover.png";

function App() {
  const [apiResponse, setApiResponse] = useState(null);
  const [sseMessages, setSseMessages] = useState([]); // State to store SSE messages
  const [updates, setUpdates] = useState([]);
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

  // Effect hook to listen for SSE events
  useEffect(() => {
    const eventSource = new EventSource("/api/events");

    eventSource.onmessage = (event) => {
      const newEvent = JSON.parse(event.data);
      setSseMessages((prevMessages) => [...prevMessages, newEvent]);
    };

    eventSource.onerror = (error) => {
      console.error("EventSource failed:", error);
      eventSource.close();
      // Implementing a basic reconnection attempt
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  useEffect(() => {
    fetchUpdates(); // Initial fetch
    const intervalId = setInterval(fetchUpdates, 10000); // Poll every 10 seconds

    return () => clearInterval(intervalId); // Cleanup on component unmount
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
        <h1>Updates</h1>
        <ul>
          {updates.map((update) => (
            <li key={update.id}>
              {update.message} - {update.timestamp}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
