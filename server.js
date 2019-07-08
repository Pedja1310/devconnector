const express = require('express');

const app = express();

app.get('/', (req,res) => res.send('API running...'));

const PORT = process.env.POR || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));