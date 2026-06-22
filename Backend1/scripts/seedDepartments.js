import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Department from '../models/Department.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('MONGO_URI missing in .env');
  process.exit(1);
}

const departments = [
  { name: 'Engineering', description: 'Engineering departments' },
  { name: 'Management', description: 'Management and business' },
  { name: 'Commerce', description: 'Commerce and trade' },
  { name: 'Computer Science', description: 'CS and IT' },
  { name: 'Law', description: 'Law and legal studies' },
  { name: 'Medical', description: 'Medical and health sciences' },
];

const run = async () => {
  try {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected to MongoDB for seeding');

    const count = await Department.countDocuments();
    console.log('Existing departments:', count);
    if (count === 0) {
      const created = await Department.insertMany(departments);
      console.log('Inserted departments:', created.length);
    } else {
      console.log('Skipping insert; departments already present');
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exit(1);
  }
};

run();
