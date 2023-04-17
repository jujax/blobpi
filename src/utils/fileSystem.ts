import * as fs from "fs";

export function verifImageFolder() {
	if (!fs.existsSync("photos")) {
		fs.mkdirSync("photos");
	}
}
export function savePicture(picture: Buffer) {
	fs.writeFileSync(`photos/blob-${new Date().toISOString()}.png`, picture);
}