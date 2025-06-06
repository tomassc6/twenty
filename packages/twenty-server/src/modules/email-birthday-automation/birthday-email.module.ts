import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { TwentyORMModule } from 'src/engine/twenty-orm/twenty-orm.module';
import { BirthdayEmailService } from 'src/modules/email-birthday-automation/birthday-email.service';

@Module({
  imports: [TwentyORMModule, ScheduleModule.forRoot()],
  providers: [BirthdayEmailService],
  exports: [BirthdayEmailService],
})
export class BirthdayEmailModule {}
