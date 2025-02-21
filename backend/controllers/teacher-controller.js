const bcrypt = require('bcrypt');
const Teacher = require('../models/teacherSchema.js');
const Subject = require('../models/subjectSchema.js');

// const teacherRegister = async (req, res) => {
//     const { name, email, password, role, school, teachSubject, teachSclass } = req.body;
//     try {
//         const salt = await bcrypt.genSalt(10);
//         const hashedPass = await bcrypt.hash(password, salt);

//         const teacher = new Teacher({ name, email, password: hashedPass, role, school, teachSubject, teachSclass });
//         console.log("Received teacher details")
//         const existingTeacherByEmail = await Teacher.findOne({ email });

//         if (existingTeacherByEmail) {
//             res.send({ message: 'Email already exists' });
//         }
//         else {
//             let result = await teacher.save();
//             await Subject.findByIdAndUpdate(teachSubject, { teacher: teacher._id });
//             result.password = undefined;
//             res.send(result);
//         }
//     } catch (err) {
//         console.log(err.message)
//         res.status(500).json(err);
//     }
// };

const teacherRegister = async (req, res) => {
    const { name, email, password, role, school, teachSubject, teachSclass } = req.body;
    console.log('Received request body:', req.body);
    try {
        // Add validation for password
        if (!password) {
            return res.status(400).json({ message: 'Password is required' });
        }

        // Add error handling for salt generation
        let salt;
        try {
            salt = await bcrypt.genSalt(10);
        } catch (error) {
            return res.status(500).json({ message: 'Error generating salt' });
        }

        // Add error handling for password hashing
        let hashedPass;
        try {
            hashedPass = await bcrypt.hash(password, salt);
        } catch (error) {
            return res.status(500).json({ message: 'Error hashing password' });
        }

        const teacher = new Teacher({ 
            name, 
            email, 
            password: hashedPass, 
            role, 
            school, 
            teachSubject, 
            teachSclass 
        });

        console.log("Received teacher details");
        
        const existingTeacherByEmail = await Teacher.findOne({ email });
        if (existingTeacherByEmail) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        let result = await teacher.save();
        await Subject.findByIdAndUpdate(teachSubject, { teacher: teacher._id });
        result.password = undefined;
        res.send(result);

    } catch (err) {
        console.log(err.message)
        res.status(500).json(err);
    }
};

const teacherLogIn = async (req, res) => {
    try {
        let teacher = await Teacher.findOne({ email: req.body.email });
        if (teacher) {
            const validated = await bcrypt.compare(req.body.password, teacher.password);
            if (validated) {
                teacher = await teacher.populate("teachSubject", "subName sessions")
                teacher = await teacher.populate("school", "schoolName")
                teacher = await teacher.populate("teachSclass", "sclassName")
                teacher.password = undefined;
                res.send(teacher);
            } else {
                res.send({ message: "Invalid password" });
            }
        } else {
            res.send({ message: "Teacher not found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getTeachers = async (req, res) => {
    try {
        let teachers = await Teacher.find({ school: req.params.id })
            .populate("teachSubject", "subName")
            .populate("teachSclass", "sclassName");
        if (teachers.length > 0) {
            let modifiedTeachers = teachers.map((teacher) => {
                return { ...teacher._doc, password: undefined };
            });
            res.send(modifiedTeachers);
        } else {
            res.send({ message: "No teachers found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getTeacherDetail = async (req, res) => {
    try {
        let teacher = await Teacher.findById(req.params.id)
            .populate("teachSubject", "subName sessions")
            .populate("school", "schoolName")
            .populate("teachSclass", "sclassName")
        if (teacher) {
            teacher.password = undefined;
            res.send(teacher);
        }
        else {
            res.send({ message: "No teacher found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

const getTeachersByClass = async (req, res) => {
    try {
        const subjectId = req.params.id;

        console.log("Received request for class:", classId); // Debugging Log

        const teachers = await Teacher.find({ teachClass: classId })
            .populate("teachClass", "className");

        if (!teachers || teachers.length === 0) {
            return res.status(404).json({ message: "No teachers found for this subject" });
        }

        res.status(200).json(teachers);
    } catch (error) {
        console.error("Error fetching teachers:", error);
        res.status(500).json({ message: "Error fetching teachers", error });
    }
};

const getTeachersBySubject = async (req, res) => {
    try {
        const subjectId = req.params.id;

        console.log("Received request for subject:", subjectId); // Debugging Log

        const teachers = await Teacher.find({ teachSubject: subjectId })
            .populate("teachSubject", "subName");

        if (!teachers || teachers.length === 0) {
            return res.status(404).json({ message: "No teachers found for this subject" });
        }

        res.status(200).json(teachers);
    } catch (error) {
        console.error("Error fetching teachers:", error);
        res.status(500).json({ message: "Error fetching teachers", error });
    }
};


const updateTeacherSubject = async (req, res) => {
    const { teacherId, teachSubject } = req.body;
    try {
        const updatedTeacher = await Teacher.findByIdAndUpdate(
            teacherId,
            { teachSubject },
            { new: true }
        );

        await Subject.findByIdAndUpdate(teachSubject, { teacher: updatedTeacher._id });

        res.send(updatedTeacher);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteTeacher = async (req, res) => {
    try {
        const deletedTeacher = await Teacher.findByIdAndDelete(req.params.id);

        await Subject.updateOne(
            { teacher: deletedTeacher._id, teacher: { $exists: true } },
            { $unset: { teacher: 1 } }
        );

        res.send(deletedTeacher);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteTeachers = async (req, res) => {
    try {
        const deletionResult = await Teacher.deleteMany({ school: req.params.id });

        const deletedCount = deletionResult.deletedCount || 0;

        if (deletedCount === 0) {
            res.send({ message: "No teachers found to delete" });
            return;
        }

        const deletedTeachers = await Teacher.find({ school: req.params.id });

        await Subject.updateMany(
            { teacher: { $in: deletedTeachers.map(teacher => teacher._id) }, teacher: { $exists: true } },
            { $unset: { teacher: "" }, $unset: { teacher: null } }
        );

        res.send(deletionResult);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteTeachersByClass = async (req, res) => {
    try {
        const deletionResult = await Teacher.deleteMany({ sclassName: req.params.id });

        const deletedCount = deletionResult.deletedCount || 0;

        if (deletedCount === 0) {
            res.send({ message: "No teachers found to delete" });
            return;
        }

        const deletedTeachers = await Teacher.find({ sclassName: req.params.id });

        await Subject.updateMany(
            { teacher: { $in: deletedTeachers.map(teacher => teacher._id) }, teacher: { $exists: true } },
            { $unset: { teacher: "" }, $unset: { teacher: null } }
        );

        res.send(deletionResult);
    } catch (error) {
        res.status(500).json(error);
    }
};

const teacherAttendance = async (req, res) => {
    const { status, date } = req.body;

    try {
        const teacher = await Teacher.findById(req.params.id);

        if (!teacher) {
            return res.send({ message: 'Teacher not found' });
        }

        const existingAttendance = teacher.attendance.find(
            (a) =>
                a.date.toDateString() === new Date(date).toDateString()
        );

        if (existingAttendance) {
            existingAttendance.status = status;
        } else {
            teacher.attendance.push({ date, status });
        }

        const result = await teacher.save();
        return res.send(result);
    } catch (error) {
        res.status(500).json(error)
    }
};

module.exports = {
    teacherRegister,
    teacherLogIn,
    getTeachers,
    getTeacherDetail,
    updateTeacherSubject,
    getTeachersByClass,
    getTeachersBySubject,
    deleteTeacher,
    deleteTeachers,
    deleteTeachersByClass,
    teacherAttendance
};