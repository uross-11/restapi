import pino from "pino";

/* const log = logger({
  base: {
    prettyPrint: true,
    pid: false,
  },
  timestamp: () => `,"time":"${dayjs().format}"`,
});

deprecated

// see => https://github.com/pinojs/pino/issues/1106

*/

const log = pino({
  base: undefined, // ignore pid, hostname
  timestamp: pino.stdTimeFunctions.isoTime, // https://github.com/pinojs/pino/blob/HEAD/docs/api.md#timestamp-boolean--function
  transport: {
    target: "pino-pretty",
    options: { colorize: true },
  },
});

export default log;
