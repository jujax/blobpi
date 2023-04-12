import Camera from "./camera";
import Light from "./light";
import fs from "fs";
import "dotenv-defaults/config";
import timestring from "timestring";

function sleep(ms: number) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

async function takePicture(light: Light, camera: Camera) {
	light.turnOn();
	await sleep(1000);
	const picture = await camera.takePicture();
	fs.writeFileSync(`images/blob-${new Date().toISOString()}.jpg`, picture);
	await sleep(1000);
	light.turnOff();
}

async function start() {
    verifImageFolder();
	const light = new Light();
    const camera = new Camera();
    await takePicture(light, camera);
	setInterval(async () => {
		await takePicture(light, camera);
	}, timestring(process.env.PHOTO_TIMER, "ms"));
}

start().catch((err) => {
	console.error(err);
});

function verifImageFolder() {
    if (!fs.existsSync("images")) {
        fs.mkdirSync("images");
    }
}
