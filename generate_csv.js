const fs = require('fs');
const path = require('path');

const generateCSV = (filePath, numberOfUsers) => {
    const writeStream = fs.createWriteStream(filePath);
    writeStream.write('userId\n');  

    for (let i = 1; i <= numberOfUsers; i++) {
        writeStream.write(`${i}\n`);
    }

    writeStream.end();
    writeStream.on('finish', () => {
        console.log(`CSV file has been created with ${numberOfUsers} user IDs`);
    });
    writeStream.on('error', (err) => {
        console.error('Error writing to the CSV file', err);
    });
};

const FILE_PATH = path.join(__dirname, 'user_ids.csv');
const NUMBER_OF_USERS = 10000;

generateCSV(FILE_PATH, NUMBER_OF_USERS);
