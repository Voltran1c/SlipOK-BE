const express = require("express");
const axios = require("axios");
const multer = require("multer");
const FormData = require("form-data");
const cors = require("cors");
require("dotenv").config(); // Load environment variables

const app = express();
app.use(cors()); // Allow requests from other domains
const port = 5000;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/slipok", upload.single("files"), async (req, res) => {
  const file = req.file;

  if (!process.env.API_URL) {
    return res.status(500).send("API_URL environment variable is not set.");
  }

  if (!file) {
    return res.status(400).send("No file uploaded.");
  }

  const formData = new FormData();
  formData.append("files", file.buffer, file.originalname);

  try {
    const response = await axios.post(process.env.API_URL, formData, {
      headers: {
        ...formData.getHeaders(), // Correctly set the headers for form-data
        "x-authorization": process.env.API_KEY,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error posting to external API:", error);
    res.status(500).send(error.message);
  }
});

app.get("/", async (req, res) => {
  res.json({ msg: process.env.API_URL });
});

app.listen(port, () => {
  console.log(`Server running at port: ${port}`);
});
