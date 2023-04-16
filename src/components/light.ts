import * as os from "os";
import { Gpio } from "pigpio";
import eventHandler from "./event-handler";

const arch = os.arch();
class Light {
	lightPin;
	lightEnabled: boolean;

	constructor(lightEnabled = true) {
		this.lightEnabled = lightEnabled;
		if (arch.includes("arm") && lightEnabled) {
			this.lightPin = new Gpio(+process.env.LIGHT_GPIO_PIN, {
				mode: Gpio.OUTPUT
			});
		}
		eventHandler.on("light:on", this.turnOn.bind(this));
		eventHandler.on("light:off", this.turnOff.bind(this));
	}
	turnOn() {
		if (arch.includes("arm") && this.lightEnabled) {
			this.lightPin.digitalWrite(1);
		}
	}
	turnOff() {
		if (arch.includes("arm") && this.lightEnabled) {
			this.lightPin.digitalWrite(0);
		}
	}
}

export default Light;
