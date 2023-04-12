const Liquid = require("liquid");
const engine = new Liquid.Engine();
const fs = require("fs");
const { execSync } = require("child_process");

const installDir = process.cwd();
const whereIsNpm = execSync("command -v npm").toString().trim();
const systemdFile = fs
	.readFileSync(`${installDir}/install/systemd/blobpi.service.j2`)
	.toString();

async function transformJ2() {
	const template = await engine.parse(systemdFile);
	const result = await template.render({ installDir, whereIsNpm });
	return result;
}

async function writeFileToSystemd(resultFile) {
	fs.writeFileSync("/etc/systemd/system/blobpi.service", resultFile);
	execSync("sudo systemctl daemon-reload");
	execSync("sudo systemctl enable blobpi.service");
	execSync("sudo systemctl start blobpi.service");
}

transformJ2().then((result) => writeFileToSystemd(result));
