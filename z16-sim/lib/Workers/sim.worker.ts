// sim.worker.ts
import { cpu } from "../cpu"; // adjust path as needed

type MsgToWorker =
  | { type: "loadMemory"; payload: string[] }
  | { type: "start"; frequencyHz: number }
  | { type: "stop" }
  | { type: "step" }
  | { type: "setFrequency"; frequencyHz: number }
  | { type: "keyEvent"; key: string; pressed: boolean };

let sim: cpu | null = null;
// default frequency
let freqHz = 60;
let running = false;
let PressedKeys: Record<string, boolean> = {};

onmessage = (e: MessageEvent<MsgToWorker>) => {
  switch (e.data.type) {
    case "loadMemory":
      sim = new cpu(e.data.payload);
      postMessage({ type: "loadMemory", assembly: sim.getAssembly() });
      break;

    case "start":
      if (!sim) {
        postMessage({ type: "log", text: "Error: no memory loaded" });
        return;
      }
      freqHz = e.data.frequencyHz;
      if (!running) {
        running = true;
        runLoop();
      }
      break;

    case "stop":
      if (sim) {
        running = false;
        // Post the final state when stopping
        postSimulationState();
        postMessage({ type: "log", text: "Paused simulation." });
      }
      break;

    case "step":
      if (!sim || running) return; // Don't step while running
      sim.Execute();
      sim.Handlekey(PressedKeys);
      postSimulationState();
      break;

    case "setFrequency":
      freqHz = e.data.frequencyHz;
      postMessage({ type: "log", text: `Frequency set to ${freqHz} Hz` });
      break;

    case "keyEvent":
      if (!sim) return;
      const { key, pressed } = e.data;
      if (pressed) {
        PressedKeys[key] = true;
      } else {
        delete PressedKeys[key];
      }
      break;
  }
};

async function runLoop() {
  const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

  while (running && sim) {
    // Check running in the while condition
    const startTime = performance.now();

    // Execute one instruction
    const cont = sim.Execute();
    sim.Handlekey(PressedKeys);

    // Update display based on frequency
    if (freqHz <= 45) {
      postSimulationState();
    } else {
      ScreenRefresh();
    }

    // Stop if execution returned false
    if (!cont) {
      running = false;
      break;
    }

    const endTime = performance.now();
    const executionTime = endTime - startTime;

    // Calculate wait time based on frequency
    const waitTime = Math.max(0, 1000 / freqHz - executionTime);

    // Only wait if still running
    if (running && waitTime > 0) {
      await delay(waitTime);
    }
  }

  // Clean up when loop exits
  running = false;
  postSimulationState(); // Post final state
  postMessage({ type: "log", text: "Simulation stopped." });
}

function postSimulationState() {
  if (!sim) return;
  postMessage({
    type: "state",
    pc: sim.getPC(),
    registers: sim.getRegisters(),
    memory: sim.getMemory(),
  });
}

function ScreenRefresh() {
  if (!sim) return;
  postMessage({
    type: "screen",
    registers: sim.getRegisters(),
    memory: sim.getMemory(),
  });
}
