const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = require("./app");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DB connection successful!"))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
