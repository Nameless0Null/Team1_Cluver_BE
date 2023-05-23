import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getToken } from 'src/auth/utils';
import { Manager } from 'src/entity/manager.entity';
import { Repository } from 'typeorm';
import * as nodemailer from 'nodemailer';
import { Email } from 'src/entity/email.entity';

const SERVER_URL = process.env.SERVER_URL;
console.log(SERVER_URL);
@Injectable()
export class EmailService {
  constructor(
    @InjectRepository(Manager)
    private managerRepository: Repository<Manager>,

    @InjectRepository(Email)
    private emailRepository: Repository<Email>,
  ) {}

  async 이메일중복체크({ email }): Promise<boolean> {
    const manager = await this.managerRepository.findOne({
      where: { manager_email: email },
    });
    if (manager) return true;
    else return false;
  }

  async 이메일전송({ email }) {
    const date = new Date();
    date.setHours(date.getHours() + 9);
    const date_format = date.toISOString().replace('T', ' ').substring(0, 19);

    // 이메일 내용
    const token = getToken();
    const url = SERVER_URL;
    const redirection_url = `${url}/email/token=${token};email=${email}`;
    const emailTemplate = `
    <body style="background: linear-gradient(135deg, #89ec84 0%, #abc0e4 55%, #abc0e4 83%, #c7d5ed 100%); display: flex; justify-content: center; align-items: center; height: 100vh;">
  <div class="mail_view_body" style="background-color: #fff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); padding: 40px; width: 400px; text-align: center; font-family: Arial, sans-serif;">
    <h1 class="title" style="font-size: 24px; font-weight: bold; margin-bottom: 20px; color: #555;">Cluver 이메일 인증</h1>
    <p class="paragraph" style="font-size: 16px; margin-bottom: 20px; color: #333;">Cluver 회원가입을 위한 이메일 인증을 요청하였습니다.</p>
    <div class="account-info" style="margin-bottom: 20px; color: #666;">
      <p>- 이메일: ${email}</p>
      <p>- 요청 일시: ${date}</p>
    </div>
    <a href="${redirection_url}" style="background-color: #abc0e4; color: #fff; border: none; border-radius: 4px; padding: 12px 24px; font-size: 16px; text-decoration: none; cursor: pointer; transition: background-color 0.3s;">인증받기</a>
    <div class="paragraph" style="font-size: 14px; margin-top: 20px; color: #777;">
      <ul style="text-align: left; margin-left: 20px;">
        <li>이메일 인증 요청 후 인증 링크는 발송된 시점부터 10분간만 유효합니다.</li>
        <li>인증 링크가 만료되면 재요청이 필요합니다.</li>
        <li>만약 고객님이 이메일 인증 요청하지 않으셨다면 이 메일을 무시하세요. 이메일 인증이 되지 않습니다.</li>
      </ul>
    </div>
  </div>
</body>
                  `;

    // 이메일 보내기
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_ID,
          pass: process.env.GMAIL_APP_PW,
        },
      });

      await transporter.sendMail({
        from: 'coghks0426@gmail.com',
        to: email,
        subject: `Cluver 회원가입을 위한 이메일 인증 `,
        html: emailTemplate,
      });

      // 이메일 레포지토리에, 이메일 : 토큰 저장
      // 이미 있는 이메일이면, 토큰값만 갈아끼우기.
      // isChecked는 false로.
      const result_email = await this.emailRepository.findOne({
        where: { email },
      });
      if (result_email) {
        await this.emailRepository.save({
          id: result_email.id,
          email,
          token,
          isChecked: false,
        });
      } else {
        await this.emailRepository.save({
          email,
          token,
          isChecked: false,
        });
      }

      return '이메일 전송 완료';
    } catch (error) {
      console.log('catch error :', error);
      return '에러';
    }
  }

  async 이메일인증완료체크({ email }) {
    const result = await this.emailRepository.findOne({ where: { email } });
    if (!result) {
      throw new NotFoundException('해당 이메일이 db에 없음');
    }
    const isChecked = result.isChecked;
    return isChecked;
  }

  async checkToken({ email, token }) {
    // 이메일 긁어서 이메일 찾고.
    // 해당 토큰 가져오기
    const email_result = await this.emailRepository.findOne({
      where: { email },
    });
    const token_result = email_result.token;

    // url에 포함된 토큰이, 맞는지.
    if (token_result === token) {
      await this.emailRepository.save({
        ...email_result,
        isChecked: true,
      });
      return true;
    } else {
      return false;
    }
  }
}
