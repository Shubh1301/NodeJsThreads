const { workerData, parentPort } = require('worker_threads');
const axios = require('axios');

const API_URL = 'http://localhost:3000/api/increment';

const processUserIds = async (userIds) => {
    const results = [];
    for (const userId of userIds) {
        try {
            const response = await axios.post(API_URL, { userId });
            results.push(response.data);
        } catch (error) {
            results.push({ userId, error: error.message });
        }
    }
    return results;
};

processUserIds(workerData)
    .then((results) => {
        parentPort.postMessage(results);
    })
    .catch((error) => {
        parentPort.postMessage({ error: error.message });
    });
