import timestring = require("timestring");
import Camera from "../components/camera";
import Light from "../components/light";
import { takePicture } from "../utils/camera";

async function start() {
    const light = new Light();
	const camera = new Camera();
	await takePicture(light, camera);
	setInterval(async () => {
		await takePicture(light, camera);
	}, timestring(process.env.TIMER_INTERVAL, "ms"));
}

start().catch((err) => {
    console.error(err);
    throw err;
});