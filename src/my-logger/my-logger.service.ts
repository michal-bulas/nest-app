import { ConsoleLogger, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { promises as fsPromises } from 'fs';

@Injectable()
export class MyLoggerService extends ConsoleLogger {
  async logToFile(entry) {
    const formattedEntry = `${Intl.DateTimeFormat('pl-PL', {
      dateStyle: 'short',
      timeStyle: 'short',
      timeZone: 'Europe/Warsaw',
    }).format(new Date())}\t${entry}\n`;

    try {
      if (!fs.existsSync(path.join(process.cwd(), 'logs'))) {
        await fsPromises.mkdir(path.join(process.cwd(), 'logs'));
      }
      await fsPromises.appendFile(
        path.join(process.cwd(), 'logs', 'myLogFile.log'),
        formattedEntry,
      );
    } catch (e) {
      if (e instanceof Error) console.error(e.message);
    }
  }

  log(message: any, context?: string): void {
    const entry = `${context}\t${message}`;

    this.logToFile(entry);

    super.log(message, context);
  }

  error(message: any, stackOrContext: string): void {
    const entry = `${stackOrContext}\t${message}`;

    this.logToFile(entry);

    super.error(message, stackOrContext);
  }
}
