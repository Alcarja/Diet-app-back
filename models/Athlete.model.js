const { Schema, model } = require("mongoose");

const athleteSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    name: {
      type: String,
      required: [true, "Name is required."],
      trim: true,
    },
    surname: {
      type: String,
      required: [true, "Surname is required."],
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
    },
    height: {
      type: Number,
      required: [true, "Height is required"],
    },
    weight: {
      type: Number,
      required: [true, "Weight is required"],
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
    },
    pActivity: {
      type: Number,
      required: [true, "pActivity is required"],
    },
    dailyIntake: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Athlete = model("Athlete", athleteSchema);

module.exports = Athlete;
