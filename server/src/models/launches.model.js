const axios = require("axios");

const lanchesDatabase = require("./launches.mongo");
const planets = require("./planets.mongo");

const DEFAULT_FLIGHT_NUMBER = 100;

const SPACEX_URL = "https://api.spacexdata.com/v4/launches/query";

async function poulateLaunchesColection() {
  console.log("data loading");
  const response = await axios.post(SPACEX_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  if (response.status !== 200) {
    throw new Error("lauch not downloaded");
  }

  const launchDocs = response.data.docs;

  for (const launchDoc of launchDocs) {
    const payloads = launchDoc["payloads"];
    const customers = payloads.flatMap((payload) => {
      return payload["customers"];
    });

    const launch = {
      flightNumber: launchDoc["flight_number"],
      mission: launchDoc["name"],
      rocket: launchDoc["rocket"]["name"],
      launchDate: new Date(launchDoc["date_local"]),
      upcoming: launchDoc["upcoming"],
      success: launchDoc["success"],
      customers,
    };
    await saveLaunch(launch);
  }
}

async function loadLaunchesData() {
  const lauchesDownload = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });
  if (lauchesDownload) {
    console.log("is here");
  } else {
    await poulateLaunchesColection();
  }
}

async function getAllLaunches() {
  return await lanchesDatabase.find({}, { __v: 0, _id: 0 });
}

async function scheduleNewLaunch(launch) {
  const planet = await planets.findOne({ keplerName: launch.target });
  if (!planet) {
    throw new Error("Planet does not exist");
  }
  const newFlightNumber = (await getLatestFlightNumber()) + 1;

  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ["NASA", "ZTM"],
    flightNumber: newFlightNumber,
  });

  await saveLaunch(newLaunch);
}

async function saveLaunch(launch) {
  await lanchesDatabase.findOneAndUpdate(
    { flightNumber: launch.flightNumber },
    launch,
    {
      upsert: true,
    }
  );
}

async function findLaunch(filter) {
  return await lanchesDatabase.findOne(filter);
}

async function existLaunchWithId(launchId) {
  return await findLaunch({ flightNumber: launchId });
}

async function getLatestFlightNumber() {
  const latest = await lanchesDatabase.findOne().sort("-flightNumber");

  if (!latest) {
    return DEFAULT_FLIGHT_NUMBER;
  }
  return latest.flightNumber;
}

async function abortLaunchById(launchId) {
  const aborted = await lanchesDatabase.updateOne(
    { flightNumber: launchId },
    { upcoming: false, success: false }
  );
  return aborted.modifiedCount === 1;
}

module.exports = {
  loadLaunchesData,
  getAllLaunches,
  scheduleNewLaunch,
  existLaunchWithId,
  abortLaunchById,
};
