const mongoose = require('mongoose');

async function activate() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/tap-a-task');
    const result = await mongoose.connection.db.collection('users').updateMany(
      { role: 'worker', status: 'pending' },
      { $set: { status: 'active' } }
    );
    console.log(`${result.modifiedCount} workers activated.`);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

activate();
