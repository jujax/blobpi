import Camera from "../components/camera";
import Light from "../components/light";
import { savePicture } from "./fileSystem";
import { sleep } from "./time";

export async function takePicture(light: Light, camera: Camera) {
	light.turnOn();
	await sleep(100);
    const picture = await camera.takePicture();
    savePicture(picture);
	await sleep(100);
	light.turnOff();
}
