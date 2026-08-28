import { spawnSync } from "node:child_process";

function runDocker(args, options = {}) {
  return spawnSync("docker", args, {
    cwd: process.cwd(),
    encoding: "utf8",
    stdio: options.capture ? "pipe" : "inherit",
  });
}

function fail(command, result) {
  const details = [result.stdout, result.stderr].filter(Boolean).join("\n").trim();
  throw new Error(
    `${command} failed with exit code ${result.status ?? "unknown"}.${
      details ? `\n${details}` : ""
    }`,
  );
}

const running = runDocker(
  ["compose", "ps", "--status", "running", "--services"],
  { capture: true },
);
if (running.status !== 0) {
  fail("docker compose ps", running);
}

const services = running.stdout.split(/\r?\n/).filter(Boolean);
if (services.includes("firebase-emulators")) {
  console.log("Exporting Firebase emulator data before shutdown...");
  const exported = runDocker([
    "compose",
    "exec",
    "-T",
    "-w",
    "/data",
    "firebase-emulators",
    "firebase",
    "--config",
    "/workspace/firebase.json",
    "emulators:export",
    "/data/export",
    "--force",
    "--project",
    "demo-linda-writer",
  ]);
  if (exported.status !== 0) {
    fail("Firebase emulator export", exported);
  }
}

const stopped = runDocker(["compose", "down"]);
if (stopped.status !== 0) {
  fail("docker compose down", stopped);
}
