import * as pm2 from "pm2";

export class PM2Class {
	pm2Connected: boolean;
	processList;
	constructor(mainProcess = false) {
		this.connect().then((connected) => {
			console.log("PM2 connected");
			this.pm2Connected = connected;
			if (mainProcess) {
				this.handleMessages();
			}
		});
	}

	async syncProcessList() {
		const result = await this.listScripts();
		const listId = {};
		result.map((script) =>
			Object.assign(listId, { [script.name]: script.pm_id })
		);
		this.processList = listId;
		return listId;
	}

	async connect(): Promise<boolean> {
		return new Promise((resolve, reject) => {
			pm2.connect((err) => {
				if (err) {
					reject(err);
				} else {
					resolve(true);
				}
			});
		});
	}

	async listScripts(): Promise<pm2.ProcessDescription[]> {
		if (!this.pm2Connected) {
			await this.connect();
		}
		return new Promise((resolve, reject) => {
			pm2.list((err, list) => {
				if (err) {
					reject(err);
				} else {
					resolve(list);
				}
			});
		});
	}

	async startScript(scriptName: string): Promise<pm2.Proc> {
		if (!this.pm2Connected) {
			await this.connect();
		}
		return new Promise((resolve, reject) => {
			pm2.start(
				{
					script: `./build/scripts/${scriptName}.js`,
					name: scriptName
				},
				(err, apps) => {
					if (err) {
						reject(err);
					} else {
						resolve(apps);
					}
				}
			);
		});
	}

	async stopScript(scriptName: string): Promise<pm2.Proc> {
		if (!this.pm2Connected) {
			await this.connect();
		}
		return new Promise((resolve, reject) => {
			pm2.stop(scriptName, (err, apps) => {
				if (err) {
					reject(err);
				} else {
					resolve(apps);
				}
			});
		});
	}

	async stopAllScripts(): Promise<pm2.Proc> {
		if (!this.pm2Connected) {
			await this.connect();
		}
		return new Promise((resolve, reject) => {
			pm2.stop("all", (err, apps) => {
				if (err) {
					reject(err);
				} else {
					resolve(apps);
				}
			});
		});
	}

	async handleMessages() {
		if (!this.pm2Connected) {
			await this.connect();
		}
		pm2.launchBus(function (err, pm2_bus) {
			pm2_bus.on("process:msg", function (packet) {
				console.log(packet);
			});
		});
	}

	async sendMsgToScript(scriptName: string, msg: any) {
		if (!this.pm2Connected) {
			await this.connect();
		}
			await this.syncProcessList();
		const id = this.processList[scriptName];
		return new Promise((resolve, reject) => {
			pm2.sendDataToProcessId(
				id,
				{
					type: "process:msg",
					data: msg,
					topic: "process:msg"
				},
				(err, res) => { }
			);
		});
	}
}
