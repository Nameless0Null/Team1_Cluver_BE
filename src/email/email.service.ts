import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getToken } from 'src/auth/utils';
import { Manager } from 'src/entity/manager.entity';
import { SERVER_URL } from 'src/main';
import { Repository } from 'typeorm';
import * as nodemailer from 'nodemailer';
import { Email } from 'src/entity/email.entity';

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
    // const url = 'http://localhost:8080';
    const url = SERVER_URL;
    const redirection_url = `${url}/token=${token};email=${email}`;
    const emailTemplate = `
        <div class="mail_view_body">
          <table border="0" cellpadding="0" cellspacing="0" style="width:700px; table-layout:fixed; color:#000; font-size:14px; font-family:">
                <tbody><tr><td><img align="top" src="https://www.hyundai.com/content/dam/hyundai/kr/ko/images/mail-template/img_mailing_header.jpg" width="700" height="82" alt="" loading="lazy"></td></tr>
            <tr><td height="220">
                      <table width="700" border="0" cellpadding="0" cellspacing="0">
                          <tbody><tr><td colspan="3" height="30"><img align="top" src="https://www.hyundai.com/content/dam/hyundai/kr/ko/images/mail-template/bg_mailing_title_top.jpg" alt="" border="0" loading="lazy"></td></tr>
                          <tr><td width="30"><img align="top" src="https://www.hyundai.com/content/dam/hyundai/kr/ko/images/mail-template/bg_mailing_title_left.jpg" alt="" border="0" loading="lazy"></td><td width="640" height="190" bgcolor="#f4f5f7" style="background-color: #f4f5f7; background: #f4f5f7 url(https://www.hyundai.com/content/dam/hyundai/kr/ko/images/mail-template/bg_mailing_title_cont.jpg) repeat 50% 50%; text-align: center;">
                          <p style="margin: 0; font-size: 30px; font-weight: bold;">Cluver 이메일 인증</p>
                      <p style="margin: 15px 0; font-size: 16px; font-weight: bold;"></p>
                    </td><td width="30"><img align="top" src="https://www.hyundai.com/content/dam/hyundai/kr/ko/images/mail-template/bg_mailing_title_right.jpg" alt="" border="0" loading="lazy"></td></tr>
                </tbody></table>
              </td></tr>
            <tr><td width="700" style="padding: 40px 30px; text-align: left; letter-spacing: -1px;">
                        <p style="margin: 0 0 30px; font-size: 14px; font-weight: bold; line-height: 1.8;">
                  <xstring></xstring><br>
                  Cluver 회원가입을 위한 이메일 인증을 요청하였습니다.
                </p>
                <p style="margin: 0 0 30px; font-size: 14px; line-height: 1.8;">
                  <b>계정정보</b><br>
                  - 이메일: <span style="color:#00aad2;"><a href="mailto:${email}" target="_blank" rel="noreferrer noopener">${email}</a></span><br>
                  - 요청 일시: ${date_format}<br>
                  <a href="${redirection_url}" rel="noreferrer noopener" target="_blank"><button tabindex="0" type="button" style="background-color: #3387bd; color: #fff; margin-top:5px; border:none; width: 200px; max-width: 100%; min-height: 50px; height: auto; font-weight: 600; font-size: 16px; cursor:pointer; "><span>인증받기</span></button></a>
                </p>
                <p style="margin: 0 0 30px; font-size: 14px; line-height: 1.8;">
                  <b>상세설명</b><br>
                  - 이메일 인증 요청 후 인증 링크는 발송된 시점부터 10분간만 유효합니다.<br>
                  - 인증 링크가 만료되면 재 요청이 필요합니다.<br>
                  - 만약 고객님이 이메일 인증 요청하지 않으셨다면 이 메일을 무시하세요. 이메일 인증이 되지 않습니다.
                </p>
              </td></tr>		
            <tr><td style="background: #f7f3f2;">
                        <table width="700" border="0" cellpadding="0" cellspacing="0">
                            <tbody><tr><td style="padding: 30px; font-size: 12px; line-height: 1.4em; letter-spacing: -1px;">
                                    <ul style="margin: 0; padding-left: 10px;"><li style="margin-top: 5px;">본 메일은 현대자동차를 통해 고객님께서 등록하신 이메일 주소로 발송하는 발신전용 메일이며, 본 메일에 대해서는 회신을 할 수 없습니다.</li><li style="margin-top: 5px;">문의사항이 있으시면 <a href="https://www.hyundai.com/kr/ko/ask" target="_blank" style="text-decoration: none;" rel="noreferrer noopener"><strong style="color: #00aad2">Q&amp;A 게시판</strong></a> 또는 고객센터(080-600-6000)를 이용하여주시기 바랍니다.</li></ul>
                    </td></tr>
                </tbody></table>
              </td></tr>
            
          </tbody></table>
        </div></div></div></div>
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
        subject: `현대자동차 회원가입을 위한 이메일 인증을 요청하였습니다.`,
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

  async 이메일인증번호체크({ email, token }) {}
}
