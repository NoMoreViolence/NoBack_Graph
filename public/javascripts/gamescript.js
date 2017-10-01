window.onload = () => {
  // 소켓을 연결합니다
  const socket = io();


  // 게임 기록 버튼 and 게임 채팅 버튼
  $('#btn1').click(() => {
    $('.record').css('display', 'block');
    $('.chat').css('display', 'none');
  });
  $('#btn2').click(() => {
    $('.record').css('display', 'none');
    $('.chat').css('display', 'block');
  });

  // 채팅 메시지 보낼 때 Enter
  $('.tongue').keydown((key) => {
    if (key.keyCode === 13) {
      // input 메시지
      const msg = $('.tongue').val();
      // socket 전송
      socket.emit('SendMessage', { message: msg });
    }
  });
  // 버튼 클릭
  $('.sound').click(() => {
    // input 메시지
    const msg = $('.tongue').val();
    // socket 전송
    socket.emit('SendMessage', { message: msg });
  });
  // socket 응답
  socket.on('ResMessage', (data) => {
    $('.ear').append(data);
  });
};
