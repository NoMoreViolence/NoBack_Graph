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
    $('.recordboard').scrollTop($('.recordboard')[0].scrollHeight);
  });
  $('#btn2').on('click', () => {
    $('.record').css('display', 'none');
    $('.chat').css('display', 'block');
    $('.ear').scrollTop($('.ear')[0].scrollHeight);
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

  let count = 10; // 카운트
  const Running = () => {
    $('.time').empty();
    // 현재 시간
    count -= 1;
    $('.time').append(count);
  };
  let started; // 베팅 준비 시간 체크
  const start = () => {
    // 0.01초마다 실행
    started = setInterval(Running, 1000);
  };

  // 도박 게임 상황
  socket.on('Game', (data) => { // 게임 중
    $('.number').empty();
    $('.number').append(`<div>${data.data}</div>`);
    socket.emit('Game');
  });

  socket.on('Delay', (data) => { // 게임 대기 중
    $('.graph').css('background-color', 'rgba(0, 187, 255, 0.25)');
    $('.number').empty();
    $('.number').append(`<div>${data.data}</div>`);
    start();
    $('.time').append(count);
  });
  // 게임 결과 보고
  socket.on('Report', (data) => {
    clearInterval(started);
    count = 10;
    $('.time').empty();
    if (data.bet === 'Fail') {
      $('.graph').css('background-color', 'rgb(230, 90, 90)');
    } else if (data.bet === 'Success') {
      $('.graph').css('background-color', 'rgb(168, 219, 58)');
    } else if (data.bet === 'Not Betted') {
      $('.graph').css('background-color', 'rgb(100, 100, 100)');
    }
    $('.bet-btn').css('background-color', 'rgba(255, 255, 255, 0.54)'); // 버튼 색 되돌리기
    $('.money').empty();
    $('.money').append(`${data.dollar}`); // 돈
    // 기록
    $('.recordboard').append(`
      <div class="record-unit">
        <div class="record-unit-son">${data.end}</div>
        <div class="record-unit-son">${data.mybetting}</div>
        <div class="record-unit-son">${data.bet}</div>
        <div class="record-unit-son">${data.spent}</div>
        <div class="record-unit-son">${data.dollar}</div>
      </div>
    `);
    $('.recordboard').scrollTop($('.recordboard')[0].scrollHeight);
  });


  // 베팅 버튼
  $('.bet-btn').on('click', () => {
    if (username !== null) { // 이름을 입력했을 때에만
      let bettingmoney = $('.bet-money').val();
      bettingmoney *= 1;
      let cashout = $('.bet-cashout').val();
      cashout *= 1;
      let money = $('.money').text();
      money *= 1;

      if (
        bettingmoney >= 1000 &&
        money >= bettingmoney &&
        typeof bettingmoney === 'number' &&
        Number.isNaN(bettingmoney) === false &&
        typeof cashout === 'number' &&
        Number.isNaN(cashout) === false
      ) {
        socket.emit('Betting', { money: bettingmoney, out: cashout });
        return;
      }
      alert('Not right input value!, Check input value or your money');
    }
  });

  // 베팅 후
  socket.on('Betting', (data) => {
    $('.money').empty();
    $('.money').append(`${data.dollar}`);
    if (data.return === true) {
      $('.bet-btn').css('background-color', 'rgb(100, 100, 300)');
    }
  });
});
