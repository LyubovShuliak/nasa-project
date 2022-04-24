const http = require("http");

const app = require("./app");
const { loadPlanets } = require("./models/planets.model");
const { loadLaunchesData } = require("./models/launches.model");
const { mongoConnect } = require("./services/mongo");

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer() {
  await mongoConnect();
  await loadPlanets();
  await loadLaunchesData();
  server.listen(PORT, () => {
    console.log(`Listening to the port ${PORT}`);
  });
}

startServer();
