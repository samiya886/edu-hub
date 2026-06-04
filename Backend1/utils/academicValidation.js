import Course from "../models/Course.js";
import Semester from "../models/Semester.js";
import Subject from "../models/Subject.js";

const idsMatch = (left, right) => left?.toString?.() === right?.toString?.();

export const validateCourseBelongsToDepartment = async ({ department, course }) => {
  const courseDoc = await Course.findById(course).select("department");
  if (!courseDoc) {
    return { valid: false, message: "Course not found" };
  }
  if (!idsMatch(courseDoc.department, department)) {
    return { valid: false, message: "Selected course does not belong to the selected department" };
  }
  return { valid: true, courseDoc };
};

export const validateSemesterBelongsToCourse = async ({ department, course, semester }) => {
  const semesterDoc = await Semester.findById(semester).select("department course");
  if (!semesterDoc) {
    return { valid: false, message: "Semester not found" };
  }
  if (!idsMatch(semesterDoc.department, department) || !idsMatch(semesterDoc.course, course)) {
    return { valid: false, message: "Selected semester does not belong to the selected department and course" };
  }
  return { valid: true, semesterDoc };
};

export const validateSubjectBelongsToSemester = async ({ department, course, semester, subject }) => {
  const subjectDoc = await Subject.findById(subject).select("department course semester");
  if (!subjectDoc) {
    return { valid: false, message: "Subject not found" };
  }
  if (!idsMatch(subjectDoc.department, department) || !idsMatch(subjectDoc.course, course) || !idsMatch(subjectDoc.semester, semester)) {
    return { valid: false, message: "Selected subject does not belong to the selected department, course, and semester" };
  }
  return { valid: true, subjectDoc };
};

export const validateAcademicSelection = async ({ department, course, semester, subjects = [] }) => {
  const courseCheck = await validateCourseBelongsToDepartment({ department, course });
  if (!courseCheck.valid) return courseCheck;

  const semesterCheck = await validateSemesterBelongsToCourse({ department, course, semester });
  if (!semesterCheck.valid) return semesterCheck;

  for (const subject of subjects) {
    const subjectCheck = await validateSubjectBelongsToSemester({ department, course, semester, subject });
    if (!subjectCheck.valid) return subjectCheck;
  }

  return { valid: true };
};
