import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { exec } from 'child_process';

import { TwentyORMManager } from 'src/engine/twenty-orm/twenty-orm.manager';
import { PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';

@Injectable()
export class BirthdayEmailService {
  private readonly logger = new Logger(BirthdayEmailService.name);

  constructor(private readonly twentyORMManager: TwentyORMManager) {}

  async getPeopleWithBirthdayToday(): Promise<PersonWorkspaceEntity[]> {
    const personRepo =
      await this.twentyORMManager.getRepository<PersonWorkspaceEntity>(
        'person',
      );

    const people = await personRepo
      .createQueryBuilder('person')
      .where('person.isBirthdayEmailEnabled = true')
      .getMany();

    const today = new Date();
    const todayDay = today.getDate();
    const todayMonth = today.getMonth();

    return people.filter((person) => {
      const birthDate = person.birthday;

      if (!birthDate) return false;

      return (
        birthDate.getDate() === todayDay && birthDate.getMonth() === todayMonth
      );
    });
  }

  private sendEmail(to: string, subject: string, body: string) {
    const command = `echo "${body}" | mail -s "${subject}" "${to}"`;

    exec(command, (error) => {
      if (error) {
        this.logger.error(`Error sending email to ${to}: ${error.message}`);
      } else {
        this.logger.log(`Email sent successfully to ${to}`);
      }
    });
  }

  @Cron('0 9 * * *', {
    timeZone: 'Europe/London',
  })
  async handleDailyBirthdayCheck() {
    const birthdayPeople = await this.getPeopleWithBirthdayToday();

    birthdayPeople.forEach((person) => {
      const primaryEmail = person.emails?.primaryEmail;

      if (!primaryEmail) return;

      const subject = 'Happy Birthday!';
      const body = `Hi ${person.name?.firstName},\n\nHappy Birthday!\n\nWishing you a wonderful day!\n`;

      this.sendEmail(primaryEmail, subject, body);
    });
  }
}
