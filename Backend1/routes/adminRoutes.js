const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const { Department, Course, Subject } = require('../models/CategoryModels');

// 1. Get all Departments for the first dropdown
router.get('/departments', async (req, res) => {
    const departments = await Department.find();
    res.json(departments);
});

// 2. Get Courses based on selected Department
router.get('/courses/:deptId', async (req, res) => {
    const courses = await Course.find({ departmentId: req.params.deptId });
    res.json(courses);
});

// 3. Get Subjects based on Course and Semester
router.get('/subjects', async (req, res) => {
    const { courseId, semester } = req.query;
    const subjects = await Subject.find({ courseId, semester });
    res.json(subjects);
});

// 4. SAVE THE NOTE
router.post('/add-note', async (req, res) => {
    try {
        const { title, description, department, course, semester, subject } = req.body;
        
        const newNote = new Note({
            title,
            description,
            department,
            course,
            semester,
            subject
        });

        await newNote.save();
        res.status(201).json({ message: "Note added successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;