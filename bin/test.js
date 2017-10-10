const digit = () => { // 자릿수 함수
  let zero = Math.floor(Math.random() * 100); // 100분의 1 확률로 그래프는 0이 된다
  zero = Number(zero);
  if (zero === 0) {
    return zero; // 그래프 0
  }

  let hundred = Math.floor(Math.random() * 100); // 100분의 1 확률로 100의자리
  hundred = Number(hundred);
  if (hundred === 0) {
    hundred = 100;
    return hundred; // 그래프 100의자리
  }

  let ten = Math.floor(Math.random() * 5); // 5분의 1 확률로 10의자리
  ten = Number(ten);
  if (ten === 0) {
    ten = 10;
    return ten; // 그래프 10의자리
  }

  return 1; // 그래프 1의자리
};
const ONE = () => { // 일의자리 함수
  let temp = Math.floor(Math.random() * 10);

  if (temp === 0 || temp === 1 || temp === 2) {
    return 0;
  }
  temp = Math.floor(Math.random() * 10);
  return temp;
};
const TEN = () => { // 십의자리 함수
  let temp = Math.floor(Math.random() * 9) + 1;

  if (temp === 1 || temp === 2 || temp === 3 || temp === 4) {
    return 10;
  }
  temp = Math.floor(Math.random() * 9) + 1;
  return temp * 10;
};
const UNDER = () => { // 소수점
  let temp = (Math.random() * 1);
  temp = temp.toFixed(2);
  temp *= 1;
  if (temp === 0) {
    temp = UNDER();
  }
  return temp;
};
const graph = (num) => { // 그래프 함수
  if (num === 0) {
    return 0; // 0
  } else if (num === 1) {
    return ONE() + UNDER(); // 1의자리
  } else if (num === 10) {
    return TEN() + ONE() + UNDER(); // 10의자리
  }
  return 100; // 100
};

console.log(graph(digit()));
