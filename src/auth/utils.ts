// 여섯자리 랜덤한 숫자 (string)
export function getToken(): string {
  const count = 6;
  const token = String(Math.floor(Math.random() * 10 ** count)).padStart(
    count,
    '0',
  );
  return token;
}

export const email_success_html = `
<div id="root" hyundai="true">
  <div class="jss6 jss1">
    <div class="jss6 jss103 type4_hyundai">
      <div class="jss108">
        <div style="width: 128px;">
          <h2>
            <img src="https://d3337ehzyte0uu.cloudfront.net/static/media/hyundai_logo.png" alt="HYUNDAI" class="jss106" />
          </h2>
        </div>
      </div>
    </div>
  <div class="jss7 jss46 grey-box">
    <div class="jss3">
      <h6 class="jss110 jss127 jss4">이메일 인증 안내</h6>
      <span class="jss110 jss120 jss5">이메일 인증이 완료되었습니다.</span>
    </div>
  </div>
  <div class="jss7 jss46 grey-line-bottom">
    <div class="inner-box">
      <div class="btn-common1">
        <button onclick="window.close()" class="jss172 jss146 jss157 jss158 jss160 jss161" tabindex="0" type="button">
          <span class="jss147">확인</span>
          <span class="jss175"></span>
        </button>
      </div>
    </div>
  </div>
</div>
`;
