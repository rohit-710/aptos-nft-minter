import React, { useState } from "react";
import "./App.css";
import axios from "axios";
import logo from "./AptosCover.png";

function App() {
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
    const options = {
      metadata: {
        description: formData.description,
        image: formData.image,
        name: formData.name,
      },
      recipient: `aptos:${formData.recipient}`,
    };

    try {
      const response = await axios.post(
        `https://staging.crossmint.com/api/2022-06-09/collections/${process.env.REACT_APP_COLLECTION_ID}/nfts`,
        options,
        {
          headers: {
            "X-API-KEY": process.env.REACT_APP_API_KEY,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      alert("Minting Successful! Check the console for response.");
    } catch (err) {
      console.error(err);
      alert("An error occurred. Check the console for details.");
      console.log(process.env.REACT_APP_COLLECTION_ID);
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
    </div>
  );
}

export default App;
