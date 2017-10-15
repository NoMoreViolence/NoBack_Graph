$('document').ready(() => {
  // 소켓을 연결합니다
  const socket = io();
  let username = null;


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


  // 도박 게임 상황
  socket.on('Game', (data) => {
    $('.graph').empty();
    $('.graph').append(`<div>${data.data}</div>`);
    socket.emit('Game');
  });
  // $('.graph').css('background-color', 'rgb(230, 90, 90)');
  socket.on('Delay', (data) => {
    $('.graph').empty();
    $('.graph').css('background-color', 'rgba(0, 187, 255, 0.25)');
    $('.graph').append(`<div>${data.data}</div>`);
  });
  // 게임 결과 보고
  socket.on('Report', (data) => {
    if (typeof data.spent === 'string' || data.spent === 0) {
      $('.graph').css('background-color', 'rgb(230, 90, 90)');
      $('.money').empty();
      $('.money').append(`${data.dollar}`);
      $('.recordboard').append(`
        <div class="record-unit">
          <div class="record-unit-son">${data.end}</div>
          <div class="record-unit-son">${data.spent}</div>
          <div class="record-unit-son">${data.dollar}</div>
        </div>
      `);
      $('.recordboard').scrollTop($('.recordboard')[0].scrollHeight);
    } else {
      $('.graph').css('background-color', 'rgb(168, 219, 58)');
      $('.money').empty();
      $('.money').append(`${data.dollar}`);
      $('.recordboard').append(`
        <div class="record-unit">
          <div class="record-unit-son">${data.end}</div>
          <div class="record-unit-son">${data.spent}</div>
          <div class="record-unit-son">${data.dollar}</div>
        </div>
      `);
      $('.recordboard').scrollTop($('.recordboard')[0].scrollHeight);
    }
  });


  // 베팅 버튼
  $('.bet-btn').on('click', () => {
    let bettingmoney = $('.bet-money').val();
    bettingmoney *= 1;
    let cashout = $('.bet-cashout').val();
    cashout *= 1;
    let money = $('.money').text();
    money *= 1;

    if (
      bettingmoney > 1000 &&
      money > bettingmoney &&
      typeof bettingmoney === 'number' &&
      Number.isNaN(bettingmoney) === false &&
      typeof cashout === 'number' &&
      Number.isNaN(cashout) === false
    ) {
      socket.emit('Betting', { money: bettingmoney, out: cashout });
      return;
    }
    alert('Not right input value!, Check input value or your money');
  });

  // 베팅 후
  socket.on('Betting', (data) => {
    $('.money').empty();
    $('.money').append(`${data.dollar}`);
  });
});
