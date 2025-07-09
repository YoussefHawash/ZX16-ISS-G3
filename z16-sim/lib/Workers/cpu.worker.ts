// worker.ts

import { cpu, SimulatorState } from "../cpu";
export enum Command {
  NONE = 0,
  LOAD = 1,
  START = 2,
  PAUSE = 3,
  STEP = 4,
  RESET = 5,
  RESUME = 6,
  KEY_DOWN = 8,
  KEY_UP = 9,
}
export type WorkerEventData = {
  command: "init";
  payload: {
    memory: SharedArrayBuffer;
    registers: SharedArrayBuffer;
    pc: number;
    state: number;
  };
};

// 1) set up and handshake
let BUFS: {
  memory: SharedArrayBuffer;
  registers: SharedArrayBuffer;
  pc: number;
  state: number;
};

self.onmessage = (event) => {
  const data = event.data as WorkerEventData;
  if (data.command === "init") {
    BUFS = {
      memory: data.payload.memory,
      registers: data.payload.registers,
      pc: data.payload.pc,
      state: data.payload.state,
    };
    main();
  }
};

function main() {
  const sim = new cpu(BUFS.memory, BUFS.registers, BUFS.pc, BUFS.state);

  // 6) handlers map
  const handlers: Record<Command, (arg: number) => void> = {
    [Command.LOAD]: () => sim.load(),
    [Command.START]: () => runLoop(),
    [Command.PAUSE]: () => sim.pause(),
    [Command.STEP]: () => sim.step(),
    [Command.RESET]: () => sim.reset(),
    [Command.RESUME]: () => resume(),
    [Command.KEY_DOWN]: (arg) => sim.keyDown(String.fromCharCode(arg)),
    [Command.KEY_UP]: (arg) => sim.keyUp(String.fromCharCode(arg)),
    [Command.NONE]: (_) => {},
  };

  // // 7) main loop
  // (async () => {
  async function runLoop() {
    if (sim.state === SimulatorState.Running) return;
    sim.state = SimulatorState.Running;

    while (sim.state === SimulatorState.Running) {
      const interval = 1000 / 30; // 30 FPS
      const t0 = performance.now();
      if (!sim.step()) break;

      // busy-wait—but still check for incoming control commands
      while (performance.now() - t0 < interval) {
        const nxt = Atomics.load(controlView, 0);
        const cmd = nxt as Command;
        if (cmd !== Command.NONE) {
          const arg = Atomics.load(controlView, 1);
          Atomics.store(controlView, 0, Command.NONE);
          if (cmd === Command.PAUSE || cmd === Command.RESET) {
            handlers[cmd](arg);
            return; // break out of runLoop
          }
          handlers[cmd](arg); // speed, keys…
        }
      }
    }
  }
            return; // break out of runLoop
          }
          handlers[nxt](arg); // speed, keys…
        }
      }
    }
  }

  function resume() {
    sim.pc += 2; // Move to the next instruction
    runLoop();
  }
}
