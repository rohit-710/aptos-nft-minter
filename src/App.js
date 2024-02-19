import React, { useState, useEffect } from "react";
import "./App.css";
import logo from "./AptosCover.png";

function App() {
  const [apiResponse, setApiResponse] = useState(null);
  const [sseMessages, setSseMessages] = useState([]); // State to store SSE messages
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

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const proxyUrl = "https://aptos-nft-minter-eight.vercel.app/api/mint-nft";

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
    const eventSource = new EventSource(
      "https://aptos-nft-minter-eight.vercel.app/api/events"
    );

    eventSource.onmessage = (event) => {
      const newEvent = JSON.parse(event.data);
      setSseMessages((prevMessages) => [...prevMessages, newEvent]);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="App">
      <form onSubmit={handleSubmit} className="form">
        {/* Form inputs and submit button */}
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
        <h2>SSE Messages:</h2>
        {sseMessages.map((msg, index) => (
          <pre key={index}>{JSON.stringify(msg, null, 2)}</pre>
        ))}
      </div>
    </div>
  );
}

export default App;
