import * as pm2 from "pm2";
import Light from "./light";
import Camera from "./camera";

export class PM2Class {
	pm2Connected: boolean;
	processList;
	lightPrototype?: Light;
	cameraPrototype?: Camera;
	constructor(mainProcess = false) {
		this.connect().then((connected) => {
			console.log("PM2 connected");
			this.pm2Connected = connected;
			if (mainProcess) {
				this.handleMessagesFromScript();
				this.lightPrototype = new Light();
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
			pm2.delete(scriptName, (err, apps) => {
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
			pm2.delete("all", (err, apps) => {
				if (err) {
					reject(err);
				} else {
					resolve(apps);
				}
			});
		});
	}

	async handleMessagesFromScript() {
		if (!this.pm2Connected) {
			await this.connect();
		}
		const that = this;
		pm2.launchBus(function (err, pm2_bus) {
			rpcList.map((rpc) => {
				pm2_bus.on(rpc, async function (packet: rpcScriptToMainProcess) {
					const topic = packet.data.topic;
					switch (topic) {
						case "getState":
							const lightStatus = that.lightPrototype.getStatus();
							await that.sendMessageToScript("backend", "getState", {
								lightStatus
							});
							break;
						case "setState":
							const { lightStatus: lS } = packet.data.value;
							if (lS === true) {
								that.lightPrototype.turnOn();
							} else if (lS === false) {
								that.lightPrototype.turnOff();
							}
							break;
					}
				});
			});
		});
	}

	async sendMessageToScript(scriptName: string, topic: string, data: any) {
		if (!this.pm2Connected) {
			await this.connect();
		}
		await this.syncProcessList();
		const id = this.processList[scriptName];
		pm2.sendDataToProcessId(
			id,
			{
				type: "process:msg",
				data,
				topic
			},
			(err, res) => {}
		);
	}
}

type rpcScriptToMainProcess = {
	data: {
		topic?: string;
		value?: any;
	};
};

const rpcList = ["getState", "takePicture", "setLight", "setState"];

