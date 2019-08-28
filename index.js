const fs = require('fs');

// Blocking, synchronous way
// const textIn = fs.readFileSync('./txt/input.txt','utf-8');
// console.log(textIn);

// const textOut = `This is what we know about the avocado ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('File written.')

// Non Blocking, asynchronous way
// fs.readFile('./txt/start.txt', 'utf-8', (err, data) => {
//     console.log(data);
// });


fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
    if (err) return console.log(err); // On simple example of error handling. To test change the name of the file above.
    fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
        console.log(data2);
        fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
            console.log(data3);            
            fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err =>{
                console.log('Files concatenated and saved')
            });
            console.log('Files read and being saved');
        });        
    });
});

console.log('Executing code ...')