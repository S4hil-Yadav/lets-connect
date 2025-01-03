function a() {
  return 1;
}

function b(a) {
  return a(4);
}

console.log(b((r) => r + 2));
console.log();
