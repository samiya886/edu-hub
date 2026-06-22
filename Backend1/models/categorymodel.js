const mongoose = require('mongoose');

const Department = mongoose.model('Department', new mongoose.Schema({ name: String }));

const Course = mongoose.model('Course', new mongoose.Schema({ 
    name: String, 
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' } 
}));

const Subject = mongoose.model('Subject', new mongoose.Schema({ 
    name: String, 
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    semester: Number
}));

module.exports = { Department, Course, Subject };