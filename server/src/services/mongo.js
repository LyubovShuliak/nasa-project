const mongoose = require("mongoose");

const MONGO_URL =
  "mongodb+srv://nasa-api:Shuly9263@nasaclaster.bymbo.mongodb.net/nasa?retryWrites=true&w=majority";

mongoose.connection.once("open", () => {
  console.log("Mongo Conection ready");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

async function mongoConnect() {
  await mongoose.connect(MONGO_URL);
}

module.exports = {
  mongoConnect,
};
