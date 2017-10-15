$('document').ready(() => {
  // 소켓을 연결합니다
  const socket = io();
  let username = null;

  /*
      이름 입력
  */
  // 이름 입력 버튼
  $('.btn_io').on('click', () => {
    const name = $('.name_io');

    if (name.val() === '') {
      alert('Input Your Name');
      return;
    }
    socket.emit('NameCheck', { name: name.val() });
  });
  // 이름 입력 버튼 Enter
  $('.name_io').on('keydown', (key) => {
    if (key.keyCode === 13) {
      const name = $('.name_io');

      if (name.val() === '') {
        alert('Input Your Name');
        return;
      }
      socket.emit('NameCheck', { name: name.val() });
    }
  });
  // 이름 소켓 받았을 때
  socket.on('NameCheck', (data) => {
    $('.name_io').val('');

    if (data.data === true) {
      username = data.name;
      $('.money').append(`${data.cash}`);
      $('.namespace').css('display', 'none');
      $('.game').css('display', 'block');
      return;
    }
    alert('Already Someone Chosen Your name, Choice another.');
  });
  /*
      이름 입력
  */


  /*
      게임과 관련된 버튼
  */
  // 게임 기록 버튼 and 게임 채팅 버튼
  $('#btn1').on('click', () => {
    $('.record').css('display', 'block');
    $('.chat').css('display', 'none');
    return false;
  });
  $('#btn2').on('click', () => {
    $('.record').css('display', 'none');
    $('.chat').css('display', 'block');
    return false;
  });
  // 채팅 메시지 보낼 때 Enter
  $('.tongue').on('keydown', (key) => {
    if (key.keyCode === 13) {
      // input 메시지
      const msg = $('.tongue');

      if (msg.val() === '') {
        return;
      }
      // socket 전송
      socket.emit('SendMessage', { message: msg.val(), name: username });
      msg.val('');
    }
  });
  // 채팅 메시지 보낼 때 버튼 클릭
  $('.sound').on('click', () => {
    // input 메시지
    const msg = $('.tongue');

    if (msg.val() === '') {
      return;
    }
    // socket 전송
    socket.emit('SendMessage', { message: msg.val(), name: username });
    msg.val('');
  });
  // 채팅 메시지 받았을 때
  socket.on('ResMessage', (data) => {
    $('.ear').append(`<div>${data.name}: ${data.msg}</div>`);
    $('.ear').scrollTop($('.ear')[0].scrollHeight);
  });

  /*
      도박 게임과 관련된 Jquery & socket
  */
  socket.on('GameStart', (data) => {
    $('.ear').append(`<div>${data.data}</div>`);
    $('.ear').scrollTop($('.ear')[0].scrollHeight);
  });
  socket.on('GameSet', (data) => {
    $('.ear').append(`<div>${data.data}</div>`);
    $('.ear').scrollTop($('.ear')[0].scrollHeight);
  });
  socket.on('Delay', (data) => {
    $('.ear').append(`<div>${data.data}</div>`);
    $('.ear').scrollTop($('.ear')[0].scrollHeight);
  });
});
