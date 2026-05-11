const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function checkWorker() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/local-service-finder');
    console.log('Connected to MongoDB');
    
    const workers = await User.find({ role: 'worker' });
    console.log('Total workers found:', workers.length);
    
    workers.forEach(w => {
      console.log(`Name: ${w.name}, Email: ${w.email}, Status: ${w.status}, City: ${w.city}, Service: ${w.service}`);
    });
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkWorker();
