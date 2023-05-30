function reverseNumber(n, b){
  // Input n and b are provided as BigInt values
  return b > 1 ? parseInt(n.toString(b).split("").reverse().join(""),b) : n
}

console.log(reverseNumber(5,1))