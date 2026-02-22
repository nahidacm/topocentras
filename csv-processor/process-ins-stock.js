const fs = require('fs');
const readline = require('readline');

const inputFile = 'stock-status-original.csv';
const outputFile = 'stock-status-processed.csv';


const readStream = fs.createReadStream(inputFile);
const writeStream = fs.createWriteStream(outputFile);

const rl = readline.createInterface({
    input: readStream,
    crlfDelay: Infinity
});

rl.on('line', (line) => {
    let newLine = line;

    newLine = newLine.trim();

    if (newLine === 'in stock') {
        newLine = 1;
    } else {
        newLine = 0;
    }

    writeStream.write(newLine + '\n');
});

rl.on('close', () => {
    console.log('Processing completed.');
});