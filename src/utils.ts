import * as fs from "fs";

export function verifImageFolder() {
	if (!fs.existsSync("photos")) {
		fs.mkdirSync("photos");
	}
}
