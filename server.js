const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.post('/api/increment', (req, res) => {
    const { userId } = req.body;
    const incrementedUserId = 2*userId + 1;
    res.send({ userId: incrementedUserId });

});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
