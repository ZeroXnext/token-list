import fs from 'fs';
import path from 'path';
import util from 'util';
import chalk from 'chalk';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerOptions {
    level?: LogLevel;           // Minimum level to log
    logToFile?: boolean;        // Whether to write logs to a file
    logFilePath?: string;       // Path for log file
}

const LEVEL_ORDER: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
};

export class Logger {
    private level: LogLevel;
    private logToFile: boolean;
    private logFilePath?: string;

    constructor(options: LoggerOptions = {}) {
        this.level = options.level ?? 'debug';
        this.logToFile = options.logToFile ?? false;
        this.logFilePath = options.logFilePath;

        if (this.logToFile && !this.logFilePath) {
            this.logFilePath = path.join(process.cwd(), 'app.log');
        }
    }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private formatMessage(level: LogLevel, message: any[]) {
        const timestamp = new Date().toISOString();
        const formatted = message.map(m => (typeof m === 'string' ? m : util.inspect(m, { depth: null }))).join(' ');
        return `[${timestamp}] [${level.toUpperCase()}] ${formatted}`;
    }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private write(level: LogLevel, message: any[]) {
        if (LEVEL_ORDER[level] < LEVEL_ORDER[this.level]) return;

        const formatted = this.formatMessage(level, message);

        // Color output for console
        switch (level) {
            case 'debug':
                console.log(chalk.gray(formatted));
                break;
            case 'info':
                console.log(chalk.blue(formatted));
                break;
            case 'warn':
                console.warn(chalk.yellow(formatted));
                break;
            case 'error':
                console.error(chalk.red(formatted));
                break;
        }

        // Optional file logging
        if (this.logToFile && this.logFilePath) {
            fs.appendFileSync(this.logFilePath, formatted + '\n');
        }
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  debug(...msg: any[]) { this.write('debug', msg); }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    info(...msg: any[]) { this.write('info', msg); }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    warn(...msg: any[]) { this.write('warn', msg); }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error(...msg: any[]) { this.write('error', msg); }

    // Scoped logger for modules
    scope(name: string) {
        return {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
            debug: (...msg: any[]) => this.debug(`[${name}]`, ...msg),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
            info: (...msg: any[]) => this.info(`[${name}]`, ...msg),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
            warn: (...msg: any[]) => this.warn(`[${name}]`, ...msg),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
            error: (...msg: any[]) => this.error(`[${name}]`, ...msg),
        };
    }
}
