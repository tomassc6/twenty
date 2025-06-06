import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as nodemailer from 'nodemailer';

import { PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';

@Injectable()
export class BirthdayMailSenderService {
  private readonly logger = new Logger(BirthdayMailSenderService.name);
  constructor(private readonly configService: ConfigService) {}

  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: this.configService.get<string>('EMAIL_USER'),
      pass: this.configService.get<string>('EMAIL_PASS'),
    },
  });

  async sendBirthdayEmail(person: PersonWorkspaceEntity) {
    const email = person.emails?.primaryEmail;

    if (!email) {
      this.logger.warn(
        `Person ${person.id} does not have a primary email address.`,
      );

      return;
    }

    const subject = 'Happy Birthday!';
    const message = `Hi ${person.name?.firstName ?? ''}, happy birthday from the team! 🎉`;

    try {
      const info = await this.transporter.sendMail({
        to: email,
        subject: subject,
        text: message,
      });

      this.logger.log(`Birthday email sent to ${email}: ${info.messageId}`);
    } catch (error) {
      this.logger.error(`Failed to send birthday email to ${email}`, error);
    }
  }
}
