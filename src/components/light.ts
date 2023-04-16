import * as os from "os";
import { Gpio } from "pigpio";

const arch = os.arch();
class Light {
	private lightPin;
	private lightStatus: boolean;

	constructor() {
		if (arch.includes("arm")) {
			this.lightPin = new Gpio(+process.env.LIGHT_GPIO_PIN, {
				mode: Gpio.OUTPUT
			});
		}
		// eventHandler.on("light:on", this.turnOn.bind(this));
		// eventHandler.on("light:off", this.turnOff.bind(this));
	}

	getStatus() {
		return this.lightStatus;
	}
	turnOn() {
		this.lightStatus = true;
		if (arch.includes("arm")) {
			this.lightPin.digitalWrite(1);
		}
	}
	turnOff() {
		this.lightStatus = false;
		if (arch.includes("arm")) {
			this.lightPin.digitalWrite(0);
		}
	}
}

export default Light;
