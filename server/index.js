const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes Placeholders
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/users.routes'));
app.use('/api/products', require('./routes/products.routes'));
app.use('/api/meals', require('./routes/mealplan.routes'));

app.get('/', (req, res) => {
    res.send('HealthScan Pro API is running');
});

// Database Connection Placeholder
// mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/healthscan')
// .then(() => console.log('MongoDB connected'))
// .catch(err => console.log(err));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
