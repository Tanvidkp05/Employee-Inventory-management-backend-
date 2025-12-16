const mongoose = require("mongoose");
const dotenv = require("dotenv");
const server = require("./server");

dotenv.config();

mongoose
  .connect(process.env.MONGO_ATLAS)
  .then(() => {
    console.log("MongoDB Connected");
    server.listen(5000, () =>
      console.log("Server running on port 5000")
    );
  })
  .catch(err => console.error(err));
