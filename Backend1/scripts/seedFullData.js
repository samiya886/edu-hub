import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Department from '../models/Department.js';
import Course from '../models/Course.js';
import Semester from '../models/Semester.js';
import Subject from '../models/Subject.js';

dotenv.config({ path: '.env' });

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding');

    // Get existing departments
    const departments = await Department.find();
    console.log(`Found ${departments.length} departments`);

    if (departments.length === 0) {
      console.log('No departments found. Please seed departments first.');
      process.exit(1);
    }

    // Clear existing data
    await Course.deleteMany({});
    await Semester.deleteMany({});
    await Subject.deleteMany({});
    console.log('Cleared existing courses, semesters, and subjects');

    // Create courses for each department
    const coursesData = [];
    const semestersData = [];
    const subjectsData = [];

    for (const dept of departments) {
      const courseNames = [
        `${dept.name} - Bachelor of Technology`,
        `${dept.name} - Master of Technology`,
      ];

      for (const courseName of courseNames) {
        const course = await Course.create({
          name: courseName,
          code: `COURSE-${dept._id}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
          department: dept._id,
          description: `${courseName} program offered by ${dept.name} department`,
        });
        coursesData.push(course);

        // Create semesters for each course
        for (let sem = 1; sem <= 4; sem++) {
          const semester = await Semester.create({
            name: `Semester ${sem}`,
            number: sem,
            course: course._id,
            department: dept._id,
            description: `Semester ${sem} of ${courseName}`,
          });
          semestersData.push(semester);

          // Create subjects for each semester
          const subjectNames = [
            `Core Subject ${sem}-1`,
            `Core Subject ${sem}-2`,
            `Elective Subject ${sem}`,
            `Practical Subject ${sem}`,
          ];

          for (const subjectName of subjectNames) {
            await Subject.create({
              name: subjectName,
              code: `SUB-${Math.random().toString(36).substr(2, 7).toUpperCase()}`,
              semester: semester._id,
              course: course._id,
              department: dept._id,
              credits: 3,
              description: `${subjectName} in ${courseName}`,
            });
          }
        }
      }
    }

    console.log(`Created ${coursesData.length} courses`);
    console.log(`Created ${semestersData.length} semesters`);
    const totalSubjects = await Subject.countDocuments();
    console.log(`Created ${totalSubjects} subjects`);

    console.log('Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
