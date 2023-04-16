import { PM2Class } from "./components/pm2";
import { verifImageFolder } from "./utils/fileSystem";
import "dotenv-defaults/config";
import "./utils/exitApp";
import * as _ from "lodash";

const pm2class = new PM2Class();

async function start() {
    try {
        verifImageFolder();
        const backendEnabled = JSON.parse(process.env.BACKEND_ENABLED || "true");
        const timeLapseEnabled = JSON.parse(
            process.env.TIMELAPSE_ENABLED || "true"
        );

        if (timeLapseEnabled) {
            await pm2class.startScript("timelapse");
        }
        if (backendEnabled) {
            await pm2class.startScript("backend");
            await pm2class.sendMsgToScript("backend", {coucou: 1});
        }
	} catch (err) {
		throw err;
	}
}

start().catch((err) => {
	console.log(err);
	throw err;
});
