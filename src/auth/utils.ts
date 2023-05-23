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
<body style="background: linear-gradient(135deg, #89ec84 0%, #abc0e4 55%, #abc0e4 83%, #c7d5ed 100%); display: flex; justify-content: center; align-items: center; height: 100vh;">
  <div id="root" style="width: 400px; padding: 20px; background-color: #fff; border-radius: 4px; text-align: center; font-family: Arial, sans-serif;">
    <div class="title" style="font-size: 24px; font-weight: bold; margin-bottom: 10px;">인증성공</div>
    <div class="subtitle" style="font-size: 18px; margin-bottom: 10px;">Cluver 이메일 인증에 성공했습니다.</div>
    <div class="content" style="font-size: 16px;">원래 페이지로 돌아가, 이메일 인증을 완료해주세요/</div>
    <button onclick="closePage()" style="margin-top: 20px; background-color: #abc0e4; color: #fff; border: none; border-radius: 4px; padding: 10px 20px; font-size: 16px; cursor: pointer;">Close</button>
  </div>

  <script>
    function closePage() {
      window.close();
    }
  </script>
</body>
`;
