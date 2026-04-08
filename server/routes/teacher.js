const express = require("express");
const router = express.Router();
const Teacher = require("../models/Teacher");

/**
 * @api {get} /api/teachers Get All Teachers
 * @apiName GetTeachers
 * @apiGroup Teachers
 * @apiDescription Returns a list of all teachers in the database.
 *
 * @apiQuery {String} [department] Filter by department name (case-insensitive).
 * @apiQuery {String} [status] Filter by status: active | inactive | on leave.
 *
 * @apiSuccess {Object[]} teachers List of teacher objects.
 * @apiSuccess {String} teachers._id Unique ID.
 * @apiSuccess {String} teachers.firstName First name.
 * @apiSuccess {String} teachers.lastName Last name.
 * @apiSuccess {String} teachers.email Email address.
 * @apiSuccess {String} teachers.department Department name.
 * @apiSuccess {String} teachers.qualification Highest qualification.
 * @apiSuccess {String} teachers.specialisation Area of specialisation.
 * @apiSuccess {String} teachers.status Employment status.
 *
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   [{ "_id": "...", "firstName": "James", "lastName": "Harrison", ... }]
 *
 * @apiError (500) InternalServerError Failed to fetch teachers.
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
    const teachers = await Teacher.find(filter).sort({ lastName: 1 });
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch teachers", error: err.message });
  }
});

/**
 * @api {get} /api/teachers/:id Get Teacher by ID
 * @apiName GetTeacher
 * @apiGroup Teachers
 * @apiDescription Returns a single teacher by their ID.
 *
 * @apiParam {String} id Teacher's unique MongoDB ID.
 *
 * @apiSuccess {Object} teacher The teacher object.
 * @apiError (404) NotFound Teacher not found.
 * @apiError (500) InternalServerError Server error.
 */
router.get("/:id", async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    res.json(teacher);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * @api {post} /api/teachers Create a New Teacher
 * @apiName CreateTeacher
 * @apiGroup Teachers
 * @apiDescription Creates a new teacher record.
 *
 * @apiBody {String} firstName Teacher's first name.
 * @apiBody {String} lastName Teacher's last name.
 * @apiBody {String} email Teacher's email (must be unique).
 * @apiBody {String} department Department name.
 * @apiBody {String} [qualification] Highest qualification (e.g. PhD Computer Science).
 * @apiBody {String} [specialisation] Area of specialisation.
 * @apiBody {String} [phone] Contact phone number.
 * @apiBody {String} [status=active] Status: active | inactive | on leave.
 * @apiBody {Date} [joinDate] Date the teacher joined.
 *
 * @apiSuccess (201) {Object} teacher Newly created teacher object.
 * @apiError (400) BadRequest Validation failed or duplicate email.
 */
router.post("/", async (req, res) => {
  try {
    const teacher = new Teacher(req.body);
    const saved = await teacher.save();
    res.status(201).json(saved);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(400).json({ message: "Validation failed", error: err.message });
  }
});

/**
 * @api {put} /api/teachers/:id Update a Teacher
 * @apiName UpdateTeacher
 * @apiGroup Teachers
 * @apiDescription Updates an existing teacher record by ID.
 *
 * @apiParam {String} id Teacher's unique MongoDB ID.
 * @apiBody {String} [firstName] First name.
 * @apiBody {String} [lastName] Last name.
 * @apiBody {String} [email] Email address.
 * @apiBody {String} [department] Department name.
 * @apiBody {String} [qualification] Highest qualification.
 * @apiBody {String} [specialisation] Area of specialisation.
 * @apiBody {String} [status] active | inactive | on leave.
 *
 * @apiSuccess {Object} teacher Updated teacher object.
 * @apiError (404) NotFound Teacher not found.
 * @apiError (400) BadRequest Validation failed.
 */
router.put("/:id", async (req, res) => {
  try {
    const updated = await Teacher.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: "Teacher not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Update failed", error: err.message });
  }
});

/**
 * @api {delete} /api/teachers/:id Delete a Teacher
 * @apiName DeleteTeacher
 * @apiGroup Teachers
 * @apiDescription Deletes a teacher record by ID.
 *
 * @apiParam {String} id Teacher's unique MongoDB ID.
 *
 * @apiSuccess {Object} message Confirmation message.
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   { "message": "Teacher deleted successfully" }
 *
 * @apiError (404) NotFound Teacher not found.
 * @apiError (500) InternalServerError Server error.
 */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Teacher.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Teacher not found" });
    res.json({ message: "Teacher deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
});

module.exports = router;