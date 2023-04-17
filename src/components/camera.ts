import { Raspistill } from "node-raspistill";
import * as os from "os";
import * as fs from "fs";

const arch = os.arch();

class Camera {
	private camera: Raspistill;
	constructor(options?: {
		encoding?: "jpg" | "png" | "gif" |"bmp",
		quality?: number,
		width?: number,
		height?: number
	}) {
		if (arch.includes("arm")) {
			this.camera = new Raspistill({
				noFileSave: true,
				noPreview: true,
				awb: "auto",
				encoding: options.encoding || "png",
				quality: options.quality || 100,
				width: options.width,
				height: options.height
			});
		}
	}
	async takePicture() {
		if (arch.includes("arm")) {
			return this.camera.takePhoto();
		} else {
			const image = fs.readFileSync("tests/test.png");
			return image;

		}
	}
}

export default Camera;
