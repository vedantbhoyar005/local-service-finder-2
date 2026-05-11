const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function setup() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/tap-a-task');
    const User = mongoose.connection.db.collection('users');
    
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('password123', salt);

    // Create User
    await User.updateOne(
      { email: 'testuser@example.com' },
      { $set: { name: 'Test User', email: 'testuser@example.com', password, role: 'user', status: 'active', city: 'Delhi' } },
      { upsert: true }
    );

    // Create Worker
    await User.updateOne(
      { email: 'testworker@example.com' },
      { $set: { name: 'Test Worker', email: 'testworker@example.com', password, role: 'worker', status: 'active', city: 'Delhi', service: 'plumber', experience: '5 years' } },
      { upsert: true }
    );

    console.log('Test accounts created.');
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

setup();
