const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();  
const simRoutes = require('./routes/simRoutes');  
const app = express();

const PORT = process.env.PORT || 8080;

const mongoURI = process.env.NODE_MONGOOSE_CONNECT ||' mongodb+srv://sappy:sappy@cluster0.jpshjbn.mongodb.net/';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected...');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

app.use(bodyParser.json());  
app.use(cors()); 

app.use('/api', simRoutes);  

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

