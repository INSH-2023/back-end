// todo golf leader board
let person1 = {name: "person1", score: [2,3,2, 4,1,2, 3,4,4,
                2,4,5, 6,3,4, 3,5,4]}
let person2 = {name: "person2",score: [3,3,2, 2,1,2, 3,4,4,
                2,1,5, 1,3,4, 3,5,4]}
let hole = [2,4,3, 3,3,2, 4,3,5,
            3,5,3, 4,2,3, 4,6,5]

// todo get score of golf person
let getScore = (person, hole) => {
    diff=[].fill(0,0,17)
    for(let i= 0; i<hole.length; i++){
        diff[i]=person[i]-hole[i]
    }
    return diff.reduce((pre,cur)=>pre+cur,0)
}

// todo match by person if 1 person is lower score that win in race
let checkMatch = (p1,p2) => {
    if(getScore(p1.score,hole) < getScore(p2.score,hole)){
        return p1.name+" is winner"
    } else {
        return p2.name+" is winner"
    }
}

console.log(checkMatch(person1,person2))