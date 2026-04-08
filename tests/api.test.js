const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server/app");

// ─── Test database ────────────────────────────────────────────────────────────
const TEST_DB = process.env.MONGO_URI_TEST || "mongodb://127.0.0.1:27017/studentdb_test";

beforeAll(async () => {
  await mongoose.connect(TEST_DB);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

// ─── Helper: clear collections between student tests ─────────────────────────
const Student = require("../server/models/Student");
const Course  = require("../server/models/Course");
const Teacher = require("../server/models/Teacher");

// ═══════════════════════════════════════════════════════════════════════════════
// STUDENTS
// ═══════════════════════════════════════════════════════════════════════════════
describe("Students API", () => {
  let studentId;

  beforeEach(async () => {
    await Student.deleteMany({});
  });

  // GET /api/students
  test("GET /api/students returns empty array when no students", async () => {
    const res = await request(app).get("/api/students");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  test("GET /api/students returns all students", async () => {
    await Student.create([
      { firstName: "Alice", lastName: "Test", email: "alice@test.com", course: "CS", year: 1 },
      { firstName: "Bob",   lastName: "Test", email: "bob@test.com",   course: "IT", year: 2 },
    ]);
    const res = await request(app).get("/api/students");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
  });

  // POST /api/students
  test("POST /api/students creates a new student", async () => {
    const newStudent = {
      firstName: "Aarav",
      lastName: "Shah",
      email: "aarav.shah@test.com",
      course: "Computer Science",
      year: 2,
      gpa: 3.7,
      status: "active",
    };
    const res = await request(app).post("/api/students").send(newStudent);
    expect(res.statusCode).toBe(201);
    expect(res.body.firstName).toBe("Aarav");
    expect(res.body.email).toBe("aarav.shah@test.com");
    studentId = res.body._id;
  });

  test("POST /api/students returns 400 when required fields are missing", async () => {
    const res = await request(app).post("/api/students").send({ firstName: "No Email" });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBeDefined();
  });

  test("POST /api/students returns 400 for duplicate email", async () => {
    const data = { firstName: "A", lastName: "B", email: "dup@test.com", course: "CS", year: 1 };
    await request(app).post("/api/students").send(data);
    const res = await request(app).post("/api/students").send(data);
    expect(res.statusCode).toBe(400);
  });

  test("POST /api/students returns 400 for invalid GPA over 4.0", async () => {
    const res = await request(app).post("/api/students").send({
      firstName: "Bad", lastName: "Gpa", email: "bad@test.com", course: "CS", year: 1, gpa: 5.0,
    });
    expect(res.statusCode).toBe(400);
  });

  // GET /api/students/:id
  test("GET /api/students/:id returns a single student", async () => {
    const student = await Student.create({
      firstName: "Priya", lastName: "Thapa", email: "priya@test.com", course: "IT", year: 3,
    });
    const res = await request(app).get(`/api/students/${student._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe("priya@test.com");
  });

  test("GET /api/students/:id returns 404 for non-existent student", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/students/${fakeId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Student not found");
  });

  test("GET /api/students/:id returns 500 for invalid ID format", async () => {
    const res = await request(app).get("/api/students/not-a-valid-id");
    expect(res.statusCode).toBe(500);
  });

  // PUT /api/students/:id
  test("PUT /api/students/:id updates a student", async () => {
    const student = await Student.create({
      firstName: "Edit", lastName: "Me", email: "edit@test.com", course: "CS", year: 1, gpa: 3.0,
    });
    const res = await request(app)
      .put(`/api/students/${student._id}`)
      .send({ gpa: 3.8, status: "active" });
    expect(res.statusCode).toBe(200);
    expect(res.body.gpa).toBe(3.8);
  });

  test("PUT /api/students/:id returns 404 for non-existent student", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).put(`/api/students/${fakeId}`).send({ gpa: 3.5 });
    expect(res.statusCode).toBe(404);
  });

  test("PUT /api/students/:id returns 400 for invalid status value", async () => {
    const student = await Student.create({
      firstName: "Val", lastName: "Test", email: "val@test.com", course: "CS", year: 1,
    });
    const res = await request(app)
      .put(`/api/students/${student._id}`)
      .send({ status: "unknown-status" });
    expect(res.statusCode).toBe(400);
  });

  // DELETE /api/students/:id
  test("DELETE /api/students/:id deletes a student", async () => {
    const student = await Student.create({
      firstName: "Del", lastName: "Me", email: "del@test.com", course: "CS", year: 1,
    });
    const res = await request(app).delete(`/api/students/${student._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Student deleted successfully");

    const check = await Student.findById(student._id);
    expect(check).toBeNull();
  });

  test("DELETE /api/students/:id returns 404 for non-existent student", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).delete(`/api/students/${fakeId}`);
    expect(res.statusCode).toBe(404);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// COURSES
// ═══════════════════════════════════════════════════════════════════════════════
describe("Courses API", () => {
  beforeEach(async () => {
    await Course.deleteMany({});
  });

  test("GET /api/courses returns empty array when no courses", async () => {
    const res = await request(app).get("/api/courses");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("POST /api/courses creates a new course", async () => {
    const res = await request(app).post("/api/courses").send({
      courseCode: "CS101",
      title: "Intro to Programming",
      department: "Computer Science",
      credits: 3,
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.courseCode).toBe("CS101");
  });

  test("POST /api/courses returns 400 for missing required fields", async () => {
    const res = await request(app).post("/api/courses").send({ title: "No Code" });
    expect(res.statusCode).toBe(400);
  });

  test("POST /api/courses returns 400 for duplicate course code", async () => {
    const data = { courseCode: "DUP101", title: "Dup", department: "CS", credits: 3 };
    await request(app).post("/api/courses").send(data);
    const res = await request(app).post("/api/courses").send(data);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Course code already exists");
  });

  test("GET /api/courses/:id returns 404 for non-existent course", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/courses/${fakeId}`);
    expect(res.statusCode).toBe(404);
  });

  test("PUT /api/courses/:id updates a course", async () => {
    const course = await Course.create({
      courseCode: "UP101", title: "Old Title", department: "IT", credits: 2,
    });
    const res = await request(app)
      .put(`/api/courses/${course._id}`)
      .send({ title: "New Title", maxCapacity: 50 });
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("New Title");
    expect(res.body.maxCapacity).toBe(50);
  });

  test("DELETE /api/courses/:id deletes a course", async () => {
    const course = await Course.create({
      courseCode: "DEL101", title: "Delete Me", department: "CS", credits: 3,
    });
    const res = await request(app).delete(`/api/courses/${course._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Course deleted successfully");
  });

  test("DELETE /api/courses/:id returns 404 for non-existent course", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).delete(`/api/courses/${fakeId}`);
    expect(res.statusCode).toBe(404);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// TEACHERS
// ═══════════════════════════════════════════════════════════════════════════════
describe("Teachers API", () => {
  beforeEach(async () => {
    await Teacher.deleteMany({});
  });

  test("GET /api/teachers returns empty array when no teachers", async () => {
    const res = await request(app).get("/api/teachers");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("POST /api/teachers creates a new teacher", async () => {
    const res = await request(app).post("/api/teachers").send({
      firstName: "James",
      lastName: "Harrison",
      email: "j.harrison@test.com",
      department: "Computer Science",
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.firstName).toBe("James");
    expect(res.body.department).toBe("Computer Science");
  });

  test("POST /api/teachers returns 400 for missing required fields", async () => {
    const res = await request(app).post("/api/teachers").send({ firstName: "No Dept" });
    expect(res.statusCode).toBe(400);
  });

  test("POST /api/teachers returns 400 for duplicate email", async () => {
    const data = { firstName: "A", lastName: "B", email: "dup.teacher@test.com", department: "CS" };
    await request(app).post("/api/teachers").send(data);
    const res = await request(app).post("/api/teachers").send(data);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Email already exists");
  });

  test("GET /api/teachers/:id returns a single teacher", async () => {
    const teacher = await Teacher.create({
      firstName: "Find", lastName: "Me", email: "find@test.com", department: "IT",
    });
    const res = await request(app).get(`/api/teachers/${teacher._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe("find@test.com");
  });

  test("GET /api/teachers/:id returns 404 for non-existent teacher", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/teachers/${fakeId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Teacher not found");
  });

  test("PUT /api/teachers/:id updates a teacher", async () => {
    const teacher = await Teacher.create({
      firstName: "Edit", lastName: "Teacher", email: "edit.t@test.com", department: "CS",
    });
    const res = await request(app)
      .put(`/api/teachers/${teacher._id}`)
      .send({ specialisation: "AI", status: "on leave" });
    expect(res.statusCode).toBe(200);
    expect(res.body.specialisation).toBe("AI");
    expect(res.body.status).toBe("on leave");
  });

  test("DELETE /api/teachers/:id deletes a teacher", async () => {
    const teacher = await Teacher.create({
      firstName: "Del", lastName: "Teacher", email: "del.t@test.com", department: "CS",
    });
    const res = await request(app).delete(`/api/teachers/${teacher._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Teacher deleted successfully");
  });

  test("DELETE /api/teachers/:id returns 404 for non-existent teacher", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).delete(`/api/teachers/${fakeId}`);
    expect(res.statusCode).toBe(404);
  });
});