const mongoose = require("mongoose");
const Student = require("../models/Student");
const Course = require("../models/Course");
const Teacher = require("../models/Teacher");
require("dotenv").config({ path: __dirname + "/../../.env" });

const students = [
  { firstName: "Aarav",    lastName: "Shah",       email: "aarav.shah@uni.edu",       course: "Computer Science",       year: 2, gpa: 3.7, status: "active",    phone: "9841000001", address: "Kathmandu, Nepal",  enrollmentDate: new Date("2023-09-01") },
  { firstName: "Priya",    lastName: "Thapa",      email: "priya.thapa@uni.edu",      course: "Information Technology", year: 3, gpa: 3.5, status: "active",    phone: "9841000002", address: "Pokhara, Nepal",    enrollmentDate: new Date("2022-09-01") },
  { firstName: "Rohan",    lastName: "Karki",      email: "rohan.karki@uni.edu",      course: "Software Engineering",   year: 1, gpa: 3.9, status: "active",    phone: "9841000003", address: "Lalitpur, Nepal",   enrollmentDate: new Date("2024-09-01") },
  { firstName: "Sita",     lastName: "Rai",        email: "sita.rai@uni.edu",         course: "Computer Science",       year: 4, gpa: 3.2, status: "active",    phone: "9841000004", address: "Biratnagar, Nepal", enrollmentDate: new Date("2021-09-01") },
  { firstName: "Bikash",   lastName: "Gurung",     email: "bikash.gurung@uni.edu",    course: "Cybersecurity",          year: 2, gpa: 3.6, status: "active",    phone: "9841000005", address: "Bhaktapur, Nepal",  enrollmentDate: new Date("2023-09-01") },
  { firstName: "Anisha",   lastName: "Poudel",     email: "anisha.poudel@uni.edu",    course: "Data Science",           year: 3, gpa: 3.8, status: "active",    phone: "9841000006", address: "Chitwan, Nepal",    enrollmentDate: new Date("2022-09-01") },
  { firstName: "Dipesh",   lastName: "Magar",      email: "dipesh.magar@uni.edu",     course: "Information Technology", year: 1, gpa: 2.9, status: "active",    phone: "9841000007", address: "Butwal, Nepal",     enrollmentDate: new Date("2024-09-01") },
  { firstName: "Kabita",   lastName: "Shrestha",   email: "kabita.shrestha@uni.edu",  course: "Software Engineering",   year: 4, gpa: 3.4, status: "graduated", phone: "9841000008", address: "Dharan, Nepal",     enrollmentDate: new Date("2021-09-01") },
  { firstName: "Nabin",    lastName: "Adhikari",   email: "nabin.adhikari@uni.edu",   course: "Computer Science",       year: 3, gpa: 3.1, status: "active",    phone: "9841000009", address: "Hetauda, Nepal",    enrollmentDate: new Date("2022-09-01") },
  { firstName: "Sunita",   lastName: "Tamang",     email: "sunita.tamang@uni.edu",    course: "Cybersecurity",          year: 2, gpa: 3.7, status: "active",    phone: "9841000010", address: "Janakpur, Nepal",   enrollmentDate: new Date("2023-09-01") },
  { firstName: "Arun",     lastName: "Basnet",     email: "arun.basnet@uni.edu",      course: "Data Science",           year: 1, gpa: 3.3, status: "active",    phone: "9841000011", address: "Nepalgunj, Nepal",  enrollmentDate: new Date("2024-09-01") },
  { firstName: "Mina",     lastName: "Limbu",      email: "mina.limbu@uni.edu",       course: "Computer Science",       year: 2, gpa: 2.8, status: "inactive",  phone: "9841000012", address: "Dhankuta, Nepal",   enrollmentDate: new Date("2023-09-01") },
  { firstName: "Suresh",   lastName: "Bhandari",   email: "suresh.bhandari@uni.edu",  course: "Software Engineering",   year: 3, gpa: 3.6, status: "active",    phone: "9841000013", address: "Ilam, Nepal",       enrollmentDate: new Date("2022-09-01") },
  { firstName: "Ritu",     lastName: "Khadka",     email: "ritu.khadka@uni.edu",      course: "Information Technology", year: 4, gpa: 3.9, status: "graduated", phone: "9841000014", address: "Birgunj, Nepal",    enrollmentDate: new Date("2021-09-01") },
  { firstName: "Prakash",  lastName: "Oli",        email: "prakash.oli@uni.edu",      course: "Cybersecurity",          year: 1, gpa: 3.0, status: "active",    phone: "9841000015", address: "Tulsipur, Nepal",   enrollmentDate: new Date("2024-09-01") },
  { firstName: "Sabina",   lastName: "Dhakal",     email: "sabina.dhakal@uni.edu",    course: "Data Science",           year: 2, gpa: 3.5, status: "active",    phone: "9841000016", address: "Damak, Nepal",      enrollmentDate: new Date("2023-09-01") },
  { firstName: "Manish",   lastName: "Chaudhary",  email: "manish.chaudhary@uni.edu", course: "Computer Science",       year: 3, gpa: 3.2, status: "active",    phone: "9841000017", address: "Ghorahi, Nepal",    enrollmentDate: new Date("2022-09-01") },
  { firstName: "Puja",     lastName: "Maharjan",   email: "puja.maharjan@uni.edu",    course: "Software Engineering",   year: 2, gpa: 3.8, status: "active",    phone: "9841000018", address: "Kirtipur, Nepal",   enrollmentDate: new Date("2023-09-01") },
  { firstName: "Santosh",  lastName: "Ghimire",    email: "santosh.ghimire@uni.edu",  course: "Information Technology", year: 1, gpa: 3.4, status: "active",    phone: "9841000019", address: "Banepa, Nepal",     enrollmentDate: new Date("2024-09-01") },
  { firstName: "Kamala",   lastName: "Yadav",      email: "kamala.yadav@uni.edu",     course: "Cybersecurity",          year: 4, gpa: 3.7, status: "graduated", phone: "9841000020", address: "Lahan, Nepal",      enrollmentDate: new Date("2021-09-01") },
  { firstName: "Nirajan",  lastName: "Pandey",     email: "nirajan.pandey@uni.edu",   course: "Data Science",           year: 3, gpa: 2.7, status: "inactive",  phone: "9841000021", address: "Itahari, Nepal",    enrollmentDate: new Date("2022-09-01") },
  { firstName: "Alisha",   lastName: "Joshi",      email: "alisha.joshi@uni.edu",     course: "Computer Science",       year: 2, gpa: 4.0, status: "active",    phone: "9841000022", address: "Bhimdatta, Nepal",  enrollmentDate: new Date("2023-09-01") },
];

const courses = [
  { courseCode: "CS101", title: "Introduction to Programming",    department: "Computer Science",       credits: 3, description: "Fundamentals of programming using Python.",              maxCapacity: 40, status: "active" },
  { courseCode: "CS201", title: "Data Structures & Algorithms",   department: "Computer Science",       credits: 4, description: "Core data structures and algorithm design.",             maxCapacity: 35, status: "active" },
  { courseCode: "CS301", title: "Web Development",                department: "Computer Science",       credits: 4, description: "Full-stack web development with Node.js and React.",    maxCapacity: 30, status: "active" },
  { courseCode: "CS401", title: "Machine Learning",               department: "Computer Science",       credits: 5, description: "Supervised and unsupervised learning techniques.",      maxCapacity: 25, status: "active" },
  { courseCode: "IT101", title: "Networking Fundamentals",        department: "Information Technology", credits: 3, description: "TCP/IP, OSI model, and network configuration.",        maxCapacity: 35, status: "active" },
  { courseCode: "IT201", title: "Database Management Systems",    department: "Information Technology", credits: 4, description: "Relational and NoSQL database design and querying.",   maxCapacity: 30, status: "active" },
  { courseCode: "SE101", title: "Software Engineering Principles",department: "Software Engineering",   credits: 3, description: "SDLC, agile methodologies, and project management.",   maxCapacity: 35, status: "active" },
  { courseCode: "SE201", title: "Software Testing & QA",          department: "Software Engineering",   credits: 3, description: "Unit testing, integration testing, and CI/CD.",        maxCapacity: 30, status: "active" },
  { courseCode: "CY101", title: "Introduction to Cybersecurity",  department: "Cybersecurity",          credits: 3, description: "Security principles, threats, and defence strategies.", maxCapacity: 30, status: "active" },
  { courseCode: "CY201", title: "Ethical Hacking",                department: "Cybersecurity",          credits: 4, description: "Penetration testing and vulnerability assessment.",     maxCapacity: 20, status: "active" },
  { courseCode: "DS101", title: "Statistics for Data Science",    department: "Data Science",           credits: 3, description: "Statistical methods and probability theory.",           maxCapacity: 35, status: "active" },
  { courseCode: "DS201", title: "Data Visualisation",             department: "Data Science",           credits: 3, description: "Visualising data using Python and D3.js.",             maxCapacity: 30, status: "active" },
];

const teachers = [
  { firstName: "James",   lastName: "Harrison", email: "j.harrison@uni.edu", department: "Computer Science",       qualification: "PhD Computer Science",    specialisation: "Machine Learning",     phone: "9841100001", status: "active",   joinDate: new Date("2018-01-15") },
  { firstName: "Priya",   lastName: "Sharma",   email: "p.sharma@uni.edu",   department: "Information Technology", qualification: "MSc Information Systems", specialisation: "Database Systems",     phone: "9841100002", status: "active",   joinDate: new Date("2019-03-01") },
  { firstName: "David",   lastName: "Nguyen",   email: "d.nguyen@uni.edu",   department: "Computer Science",       qualification: "MSc Software Engineering",specialisation: "Web Development",      phone: "9841100003", status: "active",   joinDate: new Date("2020-07-10") },
  { firstName: "Anita",   lastName: "Koirala",  email: "a.koirala@uni.edu",  department: "Software Engineering",   qualification: "PhD Software Engineering",specialisation: "Agile & DevOps",       phone: "9841100004", status: "active",   joinDate: new Date("2017-08-20") },
  { firstName: "Ahmed",   lastName: "Hassan",   email: "a.hassan@uni.edu",   department: "Cybersecurity",          qualification: "MSc Cybersecurity",       specialisation: "Network Security",     phone: "9841100005", status: "active",   joinDate: new Date("2021-01-05") },
  { firstName: "Sunita",  lastName: "Basnet",   email: "s.basnet@uni.edu",   department: "Data Science",           qualification: "PhD Statistics",          specialisation: "Data Analysis",        phone: "9841100006", status: "active",   joinDate: new Date("2019-09-01") },
  { firstName: "Michael", lastName: "Chen",     email: "m.chen@uni.edu",     department: "Computer Science",       qualification: "PhD Artificial Intelligence", specialisation: "Deep Learning",     phone: "9841100007", status: "on leave", joinDate: new Date("2016-04-12") },
  { firstName: "Rupa",    lastName: "Thapa",    email: "r.thapa@uni.edu",    department: "Information Technology", qualification: "MSc Networking",          specialisation: "Cloud Computing",      phone: "9841100008", status: "active",   joinDate: new Date("2022-02-14") },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/studentdb");
    console.log("✅ Connected to MongoDB");

    await Student.deleteMany({});
    await Course.deleteMany({});
    await Teacher.deleteMany({});
    console.log("🗑️  Cleared existing data");

    await Student.insertMany(students);
    console.log(`🌱 Seeded ${students.length} students`);

    await Course.insertMany(courses);
    console.log(`🌱 Seeded ${courses.length} courses`);

    await Teacher.insertMany(teachers);
    console.log(`🌱 Seeded ${teachers.length} teachers`);

    console.log("✅ Database seeded successfully!");
    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
}

seed();