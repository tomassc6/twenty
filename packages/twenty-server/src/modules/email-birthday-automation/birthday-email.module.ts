import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Workspace } from 'src/engine/core-modules/workspace/workspace.entity';
import { TwentyORMModule } from 'src/engine/twenty-orm/twenty-orm.module';
import { BirthdayCheckerService } from 'src/modules/email-birthday-automation/birthday-checker.service';
import { BirthdayEmailJob } from 'src/modules/email-birthday-automation/birthday-email.job';
import { BirthdayMailSenderService } from 'src/modules/email-birthday-automation/birthday-mailsender.service';

@Module({
  imports: [
    TwentyORMModule,
    ScheduleModule,
    TypeOrmModule.forFeature([Workspace], 'core'),
  ],
  providers: [
    BirthdayEmailJob,
    BirthdayCheckerService,
    BirthdayMailSenderService,
  ],
})
export class BirthdayEmailModule {}
