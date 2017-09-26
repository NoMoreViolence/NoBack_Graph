window.onload = () => {
  // 소켓을 생성합니다.
  const socket = io.connect();

  // 소켓 이벤트를 연결합니다.
  socket.on('smart', (data) => {
    alert(data);
  });

  // 문서 객체 이벤트를 연결합니다.
  document.getElementById('button').onclick = () => {
    // 변수를 선언합니다.
    const text = document.getElementById('text').value;

    // 데이터를 전송합니다.
    socket.emit('rint', text);
  };
};
