const arr = [1, 2, 3, 4, 5];

function sum(a, b) {
  console.log(a + b);
}

arr.forEach(sum.bind(null, 3));
