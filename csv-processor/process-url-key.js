const fs = require('fs');
const readline = require('readline');

const inputFile = 'links.csv';
const outputFile = 'url-keys.csv';

// Text to remove
const removeFromStart = 'https://www.topocentras.lt/';
const removeFromEnd = '.html';

const readStream = fs.createReadStream(inputFile);
const writeStream = fs.createWriteStream(outputFile);

const rl = readline.createInterface({
    input: readStream,
    crlfDelay: Infinity
});

rl.on('line', (line) => {
    let newLine = line;

    // Remove from beginning
    if (newLine.startsWith(removeFromStart)) {
        newLine = newLine.slice(removeFromStart.length);
    }

    // Remove from end
    if (newLine.endsWith(removeFromEnd)) {
        newLine = newLine.slice(0, -removeFromEnd.length);
    }

    writeStream.write(newLine + '\n');
});

rl.on('close', () => {
    console.log('Processing completed.');
});