const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    company : {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v); 
      },
      message: props => `${props.value} is not a valid 10-digit phone number!`
    }

    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: props => `${props.value} is not a valid email!`
      }
    },
    age: {
      type: Number,
      required: true
    },
    photo: {
      type: String 
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", employeeSchema);
