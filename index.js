const fs = require('fs');
const http = require('http');
const url = require('url');


//////////////////////////////////////
// FILES

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


// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//     if (err) return console.log(err); // On simple example of error handling. To test change the name of the file above.
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2);
//         fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//             console.log(data3);            
//             fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err =>{
//                 console.log('Files concatenated and saved')
//             });
//             console.log('Files read and being saved');
//         });        
//     });
// });

// console.log('Executing code ...')

//////////////////////////////////////
// SERVER

// In this case we use the Sync version because the function will only execute once when the code starts, blocking the execution for a few ms
const data = fs.readFileSync (`${__dirname}/dev-data/data.json`, 'utf-8')
const dataObj = JSON.parse(data);   

const server = http.createServer ((req, res) => {
    const pathName = req.url;

    if (pathName === '/' || pathName === '/overview') {
        res.end ('This is the OVERVIEW');
    } else if (pathName === '/product'){
        res.end ('This is the PRODUCT')
    } else if (pathName === '/api'){
        // We need to inform the brownser that we are returning json ... We use the code 200 that represent the status sucess
        res.writeHead (200, {'Content-type':'application/json'});
        // res.end need to send back an string, so we can pass the data
        res.end (data);
        
    }else {
        res.writeHead(404, {
            // The browser will now expect an html and need to be set before we send the response
            'Content-type': 'text/html',
            // We can set a custom header that can be used to send metadata
            'eror-header': 'Could not find page.'
        });
        res.end ('<h1>Page not found!</h1>')
    }   
}); 

// server.listen (port, host, callback function) -> 127.0.0.1 = localhost
// The callback function will be called as soon as the server start listening
server.listen (8000, '127.0.0.1', () => {
    console.log('Listening to requests on port 8000');    
});


