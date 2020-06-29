import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Moment } from 'moment';
import { DateUtil } from '../../common/util';
import { Alive } from './entity';

@Injectable()
export class AliveService implements OnModuleInit {

  private startTime: Moment = null;

  constructor(private logger: Logger) {
  }

  alive(): Alive {
    const now = DateUtil.now();
    const durationSeconds = Math.abs(this.startTime.diff(now, 'seconds'));
    const duration = DateUtil.formatDuration(durationSeconds, 'seconds', 'd [days] h [hour] m [min] s [sec]');
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
