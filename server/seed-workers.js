require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tap-a-task';

const workers = [
  { name: "Rajesh Kumar", email: "rajesh@worker.com", password: "worker123", role: "worker", service: "plumber", experience: "8 years", status: "active", city: "Delhi" },
  { name: "Amit Sharma", email: "amit@worker.com", password: "worker123", role: "worker", service: "electrician", experience: "10 years", status: "active", city: "Mumbai" },
  { name: "Suresh Patel", email: "suresh@worker.com", password: "worker123", role: "worker", service: "cleaner", experience: "5 years", status: "active", city: "Bangalore" },
  { name: "Vikram Singh", email: "vikram@worker.com", password: "worker123", role: "worker", service: "painter", experience: "12 years", status: "active", city: "Pune" },
  { name: "Manoj Verma", email: "manoj@worker.com", password: "worker123", role: "worker", service: "plumber", experience: "6 years", status: "active", city: "Chennai" },
  { name: "Deepak Yadav", email: "deepak@worker.com", password: "worker123", role: "worker", service: "electrician", experience: "4 years", status: "active", city: "Kolkata" },
  { name: "Ramesh Gupta", email: "ramesh@worker.com", password: "worker123", role: "worker", service: "carpenter", experience: "15 years", status: "active", city: "Hyderabad" },
  { name: "Arun Mishra", email: "arun@worker.com", password: "worker123", role: "worker", service: "mechanic", experience: "7 years", status: "active", city: "Delhi" },
  { name: "Priya Sharma", email: "priya@worker.com", password: "worker123", role: "worker", service: "cleaner", experience: "3 years", status: "active", city: "Mumbai" },
  { name: "Sanjay Dutt", email: "sanjay@worker.com", password: "worker123", role: "worker", service: "painter", experience: "9 years", status: "active", city: "Bangalore" },
  { name: "Anil Kapoor", email: "anil@worker.com", password: "worker123", role: "worker", service: "plumber", experience: "11 years", status: "active", city: "Pune" },
  { name: "Sunil Shetty", email: "sunil@worker.com", password: "worker123", role: "worker", service: "electrician", experience: "14 years", status: "active", city: "Chennai" },
  { name: "Salman Khan", email: "salman@worker.com", password: "worker123", role: "worker", service: "cleaner", experience: "2 years", status: "active", city: "Kolkata" },
  { name: "Aamir Khan", email: "aamir@worker.com", password: "worker123", role: "worker", service: "carpenter", experience: "8 years", status: "active", city: "Hyderabad" },
  { name: "Shah Rukh", email: "srk@worker.com", password: "worker123", role: "worker", service: "painter", experience: "20 years", status: "active", city: "Delhi" },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const User = mongoose.connection.collection('users');

    for (const w of workers) {
      const exists = await User.findOne({ email: w.email });
      if (exists) {
        await User.updateOne({ email: w.email }, { $set: { status: 'active', city: w.city } });
        console.log(`✅ Worker "${w.name}" already exists (${exists._id}) - ensured active & city: ${w.city}`);
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(w.password, salt);
        const result = await User.insertOne({
          ...w,
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        console.log(`✅ Created worker "${w.name}" (${result.insertedId}) in ${w.city}`);
      }
    }

    console.log('\n🎉 Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

seed();
