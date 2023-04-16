import * as express from "express";
import Camera from "./camera";

class Backend {
	port = process.env.BACKEND_PORT;
	app;
	ipcCallback;
	constructor(backendEnabled = true) {
		if (backendEnabled) {
			this.app = express();
			this.app.get("/state", this.getState.bind(this));
			this.app.get("/takePicture", this.takePicture.bind(this));
			this.app.listen(this.port, () => {
				console.log(`Express server listening on port ${this.port}`);
			});
		}
	}

	async takePicture(req, res) {
		const lightEnabled = JSON.parse(req.query.lightEnabled);
		if (lightEnabled) {
			process.send({
				type: "setState",
				data: {
					topic: "setState",
					value: {
						lightStatus: true
					}
				}
			});
		}
		const camera = new Camera();
		const photo = await camera.takePicture();
		res.set({ "Content-Type": "image/png" }).send(photo);
		if (lightEnabled) {
			process.send({
				type: "setState",
				data: {
					topic: "setState",
					value: {
						lightStatus: false
					}
				}
			});
		}
	}

	getState(req, res) {
		process.send({
			type: "getState",
			data: {
				topic: "getState"
			}
		});
		this.ipcCallback = (photoTimer, lightStatus, enableTimer) => {
			res.json({
				photoTimer,
				lightStatus,
				enableTimer
			});
		};
	}

	handleMessageFromMainProcess(packet: any) {
		const { topic, data } = packet;
	}

	sendMessageToMainProcess(type: string, data: any) {
		process.send({
			type,
			data
		});
	}
}

export default Backend;
