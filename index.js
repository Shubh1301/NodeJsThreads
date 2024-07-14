const { Worker } = require('worker_threads');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const INPUT_FILE_PATH = path.join(__dirname, 'user_ids.csv');
const OUTPUT_FILE_PATH = path.join(__dirname, 'incremented_user_ids.csv');

const createWorker = (userIds) => {
    return new Promise((resolve, reject) => {
        const worker = new Worker('./worker.js', { workerData: userIds });

        worker.on('message', resolve);
        worker.on('error', reject);
        worker.on('exit', (code) => {
            if (code !== 0) {
                reject(new Error(`Worker stopped with exit code ${code}`));
            }
        });
    });
};

const processCsvFile = async () => {
    const userIds = [];
    fs.createReadStream(INPUT_FILE_PATH)
        .pipe(csv())
        .on('data', (row) => {
            userIds.push(Number(row.userId));
        })
        .on('end', async () => {
            console.log('CSV file successfully processed');

            const writeStream = fs.createWriteStream(OUTPUT_FILE_PATH);
            writeStream.write('userId\n'); 
            const chunkSize = 10;
            for (let i = 0; i < userIds.length; i += chunkSize) {
                const chunk = userIds.slice(i, i + chunkSize);
                const results = await createWorker(chunk);
                results.forEach(result => {
                    writeStream.write(`${result.userId}\n`);
                });
            }

            writeStream.end();
            writeStream.on('finish', () => {
                console.log(`New CSV file has been created with incremented user IDs at ${OUTPUT_FILE_PATH}`);
            });
            writeStream.on('error', (err) => {
                console.error('Error writing to the new CSV file', err);
            });
        });
};

processCsvFile();
