/*
const graph = () => { // 그래프 함수
  let zero = Math.floor(Math.random() * 100); // 100분의 1 확률로 그래프는 0이 된다
  zero = Number(zero);
  if (zero === 0) {
    return zero; // 그래프 0
  }

  let hundred = Math.floor(Math.random() * 20); // 20분의 1 확률로 100의자리
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
let a = 0;
while (a < 10) {
  console.log(graph());
  a += 1;
}
console.log('HaHaHa');
*/
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
    return 1;
  }
  temp = Math.floor(Math.random() * 9) + 1;
  return temp;
};
console.log(TEN());
