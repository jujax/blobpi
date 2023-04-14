import * as os from "os";
import { Gpio } from "pigpio";
import myEE from "./event-handler";
import { LightParams } from "./types";

const arch = os.arch();
class Light {
	bluePin;
	redPin;
	greenPin;
	lightEnabled: boolean;

	constructor(lightEnabled = true) {
		this.lightEnabled = lightEnabled;
		if (arch.includes("arm") && lightEnabled) {
			this.bluePin = new Gpio(+process.env.BLUE_GPIO_PIN, {
				mode: Gpio.OUTPUT
			});
			this.redPin = new Gpio(+process.env.RED_GPIO_PIN, {
				mode: Gpio.OUTPUT
			});
			this.greenPin = new Gpio(+process.env.GREEN_GPIO_PIN, {
				mode: Gpio.OUTPUT
			});
		}
		myEE.on("light:on", this.turnOn.bind(this));
		myEE.on("light:off", this.turnOff.bind(this));
	}
	turnOn() {
		if (arch.includes("arm") && this.lightEnabled) {
			this.bluePin.digitalWrite(1);
			this.redPin.digitalWrite(1);
			this.greenPin.digitalWrite(1);
		}
	}
	turnOff() {
		if (arch.includes("arm") && this.lightEnabled) {
			this.bluePin.digitalWrite(0);
			this.redPin.digitalWrite(0);
			this.greenPin.digitalWrite(0);
		}
	}
}

export default Light;
