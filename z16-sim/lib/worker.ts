// import { CPU } from "./cpu";
import { CPU } from "./cpu";
import { SimulatorState } from "./Types/Definitions";

let buffers: {
  memory: SharedArrayBuffer;
  registers: SharedArrayBuffer;
  pc: SharedArrayBuffer;
  state: SharedArrayBuffer;
  manager: SharedArrayBuffer;
};
export enum Command {
  NONE = 0,
  LOAD = 1,
  START = 2,
  PAUSE = 3,
  STEP = 4,
  RESET = 5,
  RESUME = 6,
  KEY_DOWN = 7,
  KEY_UP = 8,
}
self.onmessage = (e) => {
  buffers = {
    memory: e.data.payload.memory,
    registers: e.data.payload.registers,
    pc: e.data.payload.pc,
    state: e.data.payload.state,
    manager: e.data.payload.manager,
  };
  main();
};
function main() {
  // To manage the CPU state, we can use a shared memory buffer
  const managerView = new Int32Array(buffers.manager);

  const cpu = new CPU(buffers);

  async function* commands() {
    while (true) {
      Atomics.wait(managerView, 0, Command.NONE);
      const cmd = Atomics.load(managerView, 0) as Command;
      const arg = Atomics.load(managerView, 1);
      Atomics.store(managerView, 0, Command.NONE);
      yield { cmd, arg };
    }
  }

  // 6) handlers map
  const handlers: Record<Command, (arg: number) => void> = {
    [Command.LOAD]: () => cpu.load(), // Load assembly code into the CPU
    [Command.START]: () => runLoop(),
    [Command.PAUSE]: () => cpu.pause(),
    [Command.STEP]: () => cpu.step(),
    [Command.RESET]: () => cpu.reset(),
    [Command.RESUME]: () => resume(),
    [Command.KEY_DOWN]: (arg) => cpu.keyDown(arg),
    [Command.KEY_UP]: (arg) => cpu.keyUp(arg),
    [Command.NONE]: (_) => {},
  };

  // 7) main loop
  (async () => {
    for await (const { cmd, arg } of commands()) {
      const h = handlers[cmd];
      if (h) h(arg);
    }
  })();

  async function runLoop() {
    if (cpu.state === SimulatorState.Running) return;
    cpu.state = SimulatorState.Running;
    while (cpu.state === SimulatorState.Running) {
      const interval = 1000 / managerView[2]; // Convert IPS to milliseconds per instruction
      const t0 = performance.now();
      if (!cpu.step()) break;

      // busy-wait—but still check for incoming control commands
      while (performance.now() - t0 < interval) {
        const nxt = Atomics.load(managerView, 0) as Command;
        if (nxt !== Command.NONE) {
          const arg = Atomics.load(managerView, 1);
          Atomics.store(managerView, 0, Command.NONE);
          Atomics.store(managerView, 1, 0); // Reset arg
          if (nxt === Command.PAUSE || nxt === Command.RESET) {
            handlers[nxt](arg);
            return; // break out of runLoop
          }
          handlers[nxt](arg); // speed, keys…
        }
      }
    }
  }

  function resume() {
    if (cpu.state !== SimulatorState.Blocked) return; // Only resume if blocked

    // if we were running, go back into the run loop;
    // otherwise just emit an update so the UI redraws
    if (cpu.prevState === SimulatorState.Running) {
      runLoop();
    } else {
      cpu.state = SimulatorState.Paused;
    }
  }
}
