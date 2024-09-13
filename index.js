const express = require("express");
const axios = require("axios");
const multer = require("multer");
const FormData = require("form-data");
const cors = require("cors");

const app = express();
app.use(cors()); // allow req server
const port = 5000;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/slipok", upload.single("files"), async (req, res) => {
  const file = req.file;
  const formData = new FormData();
  formData.append("files", file.buffer, file.originalname);
  try {
    const response = await axios.post(process.env.API_URL, formData, {
      headers: {
        "Content-Type": file.mimetype,
        "x-authorization": process.env.API_KEY,
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/", async (req, res) => {
  res.json({ msg: process.env.API_URL });
});

app.listen(port, () => {
  console.log(`server running at port: ${port}`);
});
