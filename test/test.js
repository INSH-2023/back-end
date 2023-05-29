// input ['A','A','B','A','C','C']
// output {'A': 3, 'B': 1, 'C': 2}

// input ['A','b','B','b','C','c']
// output {'A': 1, 'B': 3, 'C': 2}

// input ['','A','B','b','','C']
// output {'A': 1, 'B': 2, 'C': 1}

// input ['','A','b','a','b','A']
// output {'A': 3, 'B': 2}

let input = ['','A','b','a','b','A']
let output = {'A': 0, 'B': 0, 'C': 0}
input.forEach(e=>{
    output[e.toUpperCase()]+=1
})
Object.keys(output).forEach(key => {
    if (!output[key]) delete output[key];
});
console.log(output)