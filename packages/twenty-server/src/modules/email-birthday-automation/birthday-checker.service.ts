import { Injectable, Logger } from '@nestjs/common';

import { ExceptionHandlerService } from 'src/engine/core-modules/exception-handler/exception-handler.service';
import { Workspace } from 'src/engine/core-modules/workspace/workspace.entity';
import { TwentyORMGlobalManager } from 'src/engine/twenty-orm/twenty-orm-global.manager';
import { BirthdayMailSenderService } from 'src/modules/email-birthday-automation/birthday-mailsender.service';
import { PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';

@Injectable()
export class BirthdayCheckerService {
  private readonly logger = new Logger(BirthdayCheckerService.name);
  constructor(
    private readonly twentyORMGlobalManager: TwentyORMGlobalManager,
    private readonly exceptionHandlerService: ExceptionHandlerService,
    private readonly birthdayMailSenderService: BirthdayMailSenderService,
  ) {}

  async checkPeopleAutoMailForWorkspace(workspace: Workspace) {
    try {
      const personRepository =
        await this.twentyORMGlobalManager.getRepositoryForWorkspace<PersonWorkspaceEntity>(
          workspace.id,
          'person',
        );

      const people = await personRepository.find({
        where: {
          isBirthdayEmailEnabled: true,
        },
      });

      for (const person of people) {
        if (!person.birthday) {
          this.logger.warn(`Person ${person.id} does not have a birthday.`);

          continue;
        }
        if (person.birthday) {
          const today = new Date();
          const birthDate = new Date(person.birthday);

          if (
            birthDate.getDate() === today.getDate() &&
            birthDate.getMonth() === today.getMonth()
          ) {
            await this.birthdayMailSenderService.sendBirthdayEmail(person);
          }
        }
      }
    } catch (error) {
      this.exceptionHandlerService.captureExceptions([error], {
        workspace: {
          id: workspace.id,
        },
      });
    }
  }
}
