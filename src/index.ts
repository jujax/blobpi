import Camera from "./camera";
import Light from "./light";
import * as fs from "fs";
import "dotenv-defaults/config";
import * as timestring from "timestring";
import Backend from "./backend";
import eventHandler from "./event-handler";
import { verifImageFolder } from "./utils";

function sleep(ms: number) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

async function takePicture(light: Light, camera: Camera) {
	light.turnOn();
	await sleep(1000);
	const picture = await camera.takePicture();
	fs.writeFileSync(`photos/blob-${new Date().toISOString()}.jpg`, picture);
	await sleep(1000);
	light.turnOff();
}

async function start() {
	verifImageFolder();
	const light = new Light(!!process.env.LIGHT_ENABLED);
	const camera = new Camera(!!process.env.CAMERA_ENABLED);
	const backend = new Backend(!!process.env.BACKEND_ENABLED);

	await takePicture(light, camera);
	setInterval(async () => {
		await takePicture(light, camera);
	}, timestring(process.env.TIMER_INTERVAL, "ms"));
	
	eventHandler.on("takePicture", async () => {
		await takePicture(light, camera);
	});
}

start().catch((err) => {
	console.error(err);
});
