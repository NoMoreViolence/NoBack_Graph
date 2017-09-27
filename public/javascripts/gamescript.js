window.onload = () => {
  // 소켓을 연결합니다
  const socket = io();


  // jquery
  $('#btn1').click(() => {
    $('.record').css('display', 'block');
    $('.chat').css('display', 'none');
  });
  $('#btn2').click(() => {
    $('.record').css('display', 'none');
    $('.chat').css('display', 'block');
  });
};
