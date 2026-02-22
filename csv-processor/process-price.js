const fs = require('fs');
const readline = require('readline');

const inputFile = 'price.csv';
const outputFile = 'clean-price.csv';

// Text to remove
const removeFromEnd = 'EUR';

const readStream = fs.createReadStream(inputFile);
const writeStream = fs.createWriteStream(outputFile);

const rl = readline.createInterface({
    input: readStream,
    crlfDelay: Infinity
});

rl.on('line', (line) => {
    let newLine = line;

    // Remove from end
    if (newLine.endsWith(removeFromEnd)) {
        newLine = newLine.slice(0, -removeFromEnd.length);
    }

    newLine = newLine.trim();

    writeStream.write(newLine + '\n');
});

rl.on('close', () => {
    console.log('Processing completed.');
});