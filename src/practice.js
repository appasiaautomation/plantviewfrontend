let input=prompt("Please Enter a number");
let arr=[];
for(let i=0;i<input;i++){
    arr.push(i+1);
}
console.log(arr);

const sum= arr.reduce((prev, curr)=>{
    return prev+curr;
});
console.log(sum);

const prod = arr.reduce((prev, curr)=>{
    return prev*curr;
})
console.log(prod);

