import Backend from "../components/backend";

const backend = new Backend();

process.on("message", function (packet) {
	backend.handleMessageFromMainProcess(packet);
});

