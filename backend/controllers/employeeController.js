const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const Employee = require("../models/Employee");
const Counter = require("../models/Counter");

const getNextEmployeeId = async () => {
  const counter = await Counter.findOneAndUpdate(
    { id: "employeeId" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  return counter.seq.toString().padStart(3, "0");
};

const saveWebpImage = async (file) => {
  const uploadDir = "uploads";

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  const fileName =
    Date.now() + "-" + Math.round(Math.random() * 1e9) + ".webp";

  const filePath = path.join(uploadDir, fileName);

  await sharp(file.buffer)
    .resize(500, 500, { fit: "inside" }) // resize
    .webp({ quality: 80 }) // compression
    .toFile(filePath);

  return filePath;
};

exports.createEmployee = async (req, res) => {
  try {
    const employeeId = await getNextEmployeeId();

    let photoPath = null;
    if(req.file) {
        photoPath = await saveWebpImage(req.file);
    }

    const employee = new Employee({
      employeeId,
      name: req.body.name,
      company: req.body.company,
      phone: req.body.phone,
      email: req.body.email,
      age: req.body.age,
      photo: photoPath
    });

    await employee.save();
    res.status(201).json({
      message: "Employee created successfully",
      employee
    });
  } catch (error) {
    if (photoPath) fs.promises.unlink(photoPath);
    res.status(400).json({ error: error.message });
  }
};

exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById({
      employeeId: req.params.employeeId
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEmployeeByCompany = async (req, res) => {
  try {
    const employees = await Employee.find({
      company: req.params.company
    });

    if( employees.length === 0) {
      return res.status(404).json({ message: "No employees found for this company" });
    }

    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findOneAndDelete({
      employeeId: req.params.employeeId
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const updates = {};
 

    if (req.body.name) updates.name = req.body.name;
    if (req.body.company) updates.company = req.body.company;
    if (req.body.phone) updates.phone = req.body.phone;
    if (req.body.email) updates.email = req.body.email;
    if (req.body.age) updates.age = req.body.age;

    if (req.file) {
        updates.photo = await saveWebpImage(req.file);
    }

    const employee = await Employee.findOneAndUpdate(
      { employeeId: req.params.employeeId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json({
      message: "Employee updated successfully",
      employee
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
