import { Raspistill } from "node-raspistill";
import CronJob from "cron";
import { discoverAndCreateUser } from "./hue-functions";
import fs from "fs";
// const camera = new Raspistill();

// camera.takePhoto().then((photo) => { });

async function start() {
    // const createdUser = await discoverAndCreateUser();
    fs.writeFileSync("./user.json", JSON.stringify({test: 1}));
}

start().catch((err) => {
    console.error(err);
});