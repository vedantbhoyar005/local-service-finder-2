const mongoose = require('mongoose');

const check = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/tap-a-task');
    console.log('Connected to MongoDB. Finding users...');
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    if (collections.some(c => c.name === 'users')) {
      const users = await db.collection('users').find({}).toArray();
      console.log('Users found:', users.length);
      console.log(users);
    } else {
      console.log('No users collection found.');
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit(0);
  }
};

check();
