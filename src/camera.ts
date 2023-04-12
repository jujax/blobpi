import { Raspistill } from "node-raspistill";
import os from "os";
import fs from "fs";

const arch = os.arch();

class Camera {
	private camera: Raspistill;

	cameraEnabled: boolean;
	constructor(cameraEnabled = true) {
		this.cameraEnabled = cameraEnabled;
		if (arch.includes("arm")) {
			this.camera = new Raspistill({
				noFileSave: true
			});
		}
	}
	takePicture() {
		if (arch.includes("arm") && this.cameraEnabled) {
			return this.camera.takePhoto();
		} else {
			const image = fs.readFileSync("tests/test.png");
			return image;

		}
	}
}

export default Camera;