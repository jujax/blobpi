import os from "os";
import { Gpio } from "pigpio";

const arch = os.arch();
class Light {
	bluePin;
	redPin;
	greenPin;

	constructor() {
		if (arch.includes("arm")) {
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
	}
	turnOn() {
		if (arch.includes("arm")) {
			this.bluePin.digitalWrite(1);
			this.redPin.digitalWrite(1);
			this.greenPin.digitalWrite(1);
		}
	}
	turnOff() {
		if (arch.includes("arm")) {
			this.bluePin.digitalWrite(0);
			this.redPin.digitalWrite(0);
			this.greenPin.digitalWrite(0);
		}
	}
}

export default Light;
