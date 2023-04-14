import * as fs from "fs";

export function verifImageFolder() {
	if (!fs.existsSync("images")) {
		fs.mkdirSync("images");
	}
}
