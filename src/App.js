import React, { useState } from "react";
import "./App.css";
import axios from "axios";
import logo from "./AptosCover.png";

function App() {
  const [apiResponse, setApiResponse] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    recipient: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

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
      {apiResponse && (
        <div className="response">
          <h2>API Response:</h2>
          <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
