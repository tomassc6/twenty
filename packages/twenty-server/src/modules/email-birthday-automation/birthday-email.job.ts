import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';

import { WorkspaceActivationStatus } from 'twenty-shared/workspace';
import { Repository } from 'typeorm';

import { ExceptionHandlerService } from 'src/engine/core-modules/exception-handler/exception-handler.service';
import { Workspace } from 'src/engine/core-modules/workspace/workspace.entity';
import { TwentyORMGlobalManager } from 'src/engine/twenty-orm/twenty-orm-global.manager';
import { BirthdayCheckerService } from 'src/modules/email-birthday-automation/birthday-checker.service';
@Injectable()
export class BirthdayEmailJob {
  private readonly logger = new Logger(BirthdayEmailJob.name);

  constructor(
    @InjectRepository(Workspace, 'core')
    private readonly workspaceRepository: Repository<Workspace>,
    private readonly twentyORMGlobalManager: TwentyORMGlobalManager,
    private readonly exceptionHandlerService: ExceptionHandlerService,
    private readonly birthdayCheckerService: BirthdayCheckerService,
  ) {}

  @Cron('0 9 * * *', {
    timeZone: 'Europe/London',
  })
  async handleDailyBirthdayEmails() {
    const activeWorkspaces = await this.workspaceRepository.find({
      where: {
        activationStatus: WorkspaceActivationStatus.ACTIVE,
      },
    });

    for (const workspace of activeWorkspaces) {
      this.birthdayCheckerService.checkPeopleAutoMailForWorkspace(workspace);
    }
  }
}
