const express = require("express");
const router = express.Router();
const Course = require("../models/Course");

/**
 * @api {get} /api/courses Get All Courses
 * @apiName GetCourses
 * @apiGroup Courses
 * @apiDescription Returns a list of all courses in the database.
 *
 * @apiQuery {String} [department] Filter courses by department name (case-insensitive).
 * @apiQuery {String} [status] Filter by status: active | inactive.
 *
 * @apiSuccess {Object[]} courses List of course objects.
 * @apiSuccess {String} courses._id Unique ID.
 * @apiSuccess {String} courses.courseCode Unique course code (e.g. CS101).
 * @apiSuccess {String} courses.title Course title.
 * @apiSuccess {String} courses.department Department name.
 * @apiSuccess {Number} courses.credits Credit hours.
 * @apiSuccess {String} courses.description Course description.
 * @apiSuccess {Number} courses.maxCapacity Maximum student capacity.
 * @apiSuccess {String} courses.status Course status.
 *
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   [{ "_id": "...", "courseCode": "CS101", "title": "Intro to Programming", ... }]
 *
 * @apiError (500) InternalServerError Failed to fetch courses.
 */
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.department) {
      filter.department = { $regex: req.query.department, $options: "i" };
    }
    if (req.query.status) {
      filter.status = req.query.status;
    }
    const courses = await Course.find(filter).sort({ courseCode: 1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch courses", error: err.message });
  }
});

/**
 * @api {get} /api/courses/:id Get Course by ID
 * @apiName GetCourse
 * @apiGroup Courses
 * @apiDescription Returns a single course by its ID.
 *
 * @apiParam {String} id Course's unique MongoDB ID.
 *
 * @apiSuccess {Object} course The course object.
 * @apiError (404) NotFound Course not found.
 * @apiError (500) InternalServerError Server error.
 */
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * @api {post} /api/courses Create a New Course
 * @apiName CreateCourse
 * @apiGroup Courses
 * @apiDescription Creates a new course record.
 *
 * @apiBody {String} courseCode Unique course code (e.g. CS101).
 * @apiBody {String} title Course title.
 * @apiBody {String} department Department offering the course.
 * @apiBody {Number} credits Credit hours (1–6).
 * @apiBody {String} [description] Course description.
 * @apiBody {Number} [maxCapacity=30] Maximum number of students.
 * @apiBody {String} [status=active] Status: active | inactive.
 *
 * @apiSuccess (201) {Object} course Newly created course object.
 * @apiError (400) BadRequest Validation failed or duplicate course code.
 */
router.post("/", async (req, res) => {
  try {
    const course = new Course(req.body);
    const saved = await course.save();
    res.status(201).json(saved);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Course code already exists" });
    }
    res.status(400).json({ message: "Validation failed", error: err.message });
  }
});

/**
 * @api {put} /api/courses/:id Update a Course
 * @apiName UpdateCourse
 * @apiGroup Courses
 * @apiDescription Updates an existing course record by ID.
 *
 * @apiParam {String} id Course's unique MongoDB ID.
 * @apiBody {String} [courseCode] Course code.
 * @apiBody {String} [title] Course title.
 * @apiBody {String} [department] Department name.
 * @apiBody {Number} [credits] Credit hours.
 * @apiBody {String} [description] Course description.
 * @apiBody {Number} [maxCapacity] Maximum student capacity.
 * @apiBody {String} [status] active | inactive.
 *
 * @apiSuccess {Object} course Updated course object.
 * @apiError (404) NotFound Course not found.
 * @apiError (400) BadRequest Validation failed.
 */
router.put("/:id", async (req, res) => {
  try {
    const updated = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: "Course not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Update failed", error: err.message });
  }
});

/**
 * @api {delete} /api/courses/:id Delete a Course
 * @apiName DeleteCourse
 * @apiGroup Courses
 * @apiDescription Deletes a course record by ID.
 *
 * @apiParam {String} id Course's unique MongoDB ID.
 *
 * @apiSuccess {Object} message Confirmation message.
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   { "message": "Course deleted successfully" }
 *
 * @apiError (404) NotFound Course not found.
 * @apiError (500) InternalServerError Server error.
 */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Course.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Course not found" });
    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
});

module.exports = router;