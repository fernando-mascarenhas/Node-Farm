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

const replaceTemplate = (template, product) => {
    let output = template.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);

    if (!product.organic){
        output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    } 

    return output;
};


// In these cases we use the Sync version because the function will only execute once when the code starts, blocking the execution for a few ms
const tempOverview = fs.readFileSync (`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync (`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync (`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync (`${__dirname}/dev-data/data.json`, 'utf-8')
const dataObj = JSON.parse(data);

const server = http.createServer ((req, res) => {
    const pathName = req.url;


    // Overview page
    if (pathName === '/' || pathName === '/overview') {
        res.writeHead (200, {'Content-type': 'text/html'})        
        
        // Use map to create an array with all the cards
        const cardsHtml = dataObj.map (el => replaceTemplate (tempCard, el)) 
        
        // Replace the {%PRODUCT_CARDS%} with a string resulting of all elements of the cardsHtml array
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml.join());

        res.end (output);

    // Product Page
    } else if (pathName.substring(0, pathName.indexOf("?")) === '/product'){
        res.writeHead (200, {'Content-type': 'text/html'})    

        // Geting verything after the =
        const id = pathName.substring(pathName.indexOf("=")+1)

        // Replacing the tenplate with the info from the dataObj
        const output = replaceTemplate (tempProduct, dataObj[id]);
        
        res.end (output);


    // API        
    } else if (pathName === '/api'){
        // We need to inform the brownser that we are returning json ... We use the code 200 that represent the status sucess
        res.writeHead (200, {'Content-type':'application/json'});
        // res.end need to send back an string, so we can pass the data
        res.end (data);
        
    // Not found
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


