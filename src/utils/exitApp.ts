import { PM2Class } from "../components/pm2";

const pm2class = new PM2Class();

const exitList = [
	"beforeExit",
	"uncaughtException",
	"unhandledRejection",
	"SIGHUP",
	"SIGINT",
	"SIGQUIT",
	"SIGILL",
	"SIGTRAP",
	"SIGABRT",
	"SIGBUS",
	"SIGFPE",
	"SIGUSR1",
	"SIGSEGV",
	"SIGUSR2",
	"SIGTERM"
];

exitList.forEach((evt) =>
	process.on(evt, async () => {
		console.log("Exit app:", evt);
		await pm2class.stopAllScripts();
		if (evt === "uncaughtException" || evt === "unhandledRejection") {
			process.exit(1);
		} else {
			process.exit(0);
		}
	})
);
