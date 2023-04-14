import myEE from "./event-handler";
import * as express from "express";

class Backend {
	port = process.env.BACKEND_PORT;
	app;

	photoTimer = process.env.TIMER_INTERVAL;
	lightStatus = false
	enableTimer = !!process.env.ENABLE_TIMER;
	constructor(backendEnabled = true) {
		if (backendEnabled) {
			this.app = express();
			this.app.get("/", this.getHome.bind(this));
			this.app.get("/photos", this.getPhotosList.bind(this));
			this.app.get("/photos/:id", this.getPhoto.bind(this));
			this.app.post("/photos", this.postPhoto.bind(this));
			this.app.post("/light", this.postLight.bind(this));
			this.app.get("/config", this.getConfig.bind(this));
			this.app.post("/config", this.postConfig.bind(this));
			this.app.listen(this.port, () => {
				console.log(`Express server listening on port ${this.port}`);
			});
		}
	}

	getHome(req, res) {
		res.send("Hello World!");
	}

	getPhotosList(req, res) {
		res.send("Photos List");
	}

	getPhoto(req, res) {
		const id = req.params.id;
		res.send(`Photo ${id}`);
	}

	postPhoto(req, res) {
		myEE.emit("takePicture");
		res.send("takePicture");
	}

	postLight(req, res) {
		const { status } = req.body;
		myEE.emit(`light:${status ? "on" : "off"}`);
		res.json({
			status
		});
	}

	getConfig(req, res) {
		res.json({
			photoTimer: this.photoTimer,
			lightStatus: this.lightStatus,
			enableTimer: this.enableTimer
		});
	}

	postConfig(req, res) {
		const { photoTimer, lightStatus, enableTimer } = req.body;
		this.photoTimer = photoTimer;
		this.lightStatus = lightStatus;
		this.enableTimer = enableTimer;
		res.json({
			photoTimer: this.photoTimer,
			lightStatus: this.lightStatus,
			enableTimer: this.enableTimer
		});
	}
}

export default Backend;
