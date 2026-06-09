const express = require('express');
const cors = require('cors');
require('dotenv').config();

const applicationRoutes = require('./routes/applicationRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// api routes
app.use('/api', applicationRoutes);

app.get('/', (req, res) => {
  res.send('Vitto Loan Application API is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
