import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DateTime } from 'luxon';
import { DateUtil } from '../../common/util';
import { Alive } from './entity';

@Injectable()
export class AliveService implements OnModuleInit {

  private startTime: DateTime = null;

  constructor(private logger: Logger) {
  }

  alive(): Alive {
    const duration = DateUtil.formatDuration(this.startTime, 'seconds', 'd hh:mm:ss.SSS');
    return {
      start: DateUtil.formatDateTime(this.startTime),
      duration,
    };
  }


  initialService(): void {
    this.startTime = DateUtil.now();
    this.logger.log(`Start time ${DateUtil.formatTimestamp(this.startTime)}`, 'alive')
  }

  onModuleInit(): any {
    this.initialService();
  }
}
