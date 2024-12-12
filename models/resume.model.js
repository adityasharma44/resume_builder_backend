import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "user",
    },
    name: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      required: false,
      default: null,
    },
    phone: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    github: {
      type: String,
      required: false,
      default: null,
    },
    linkedIn: {
      type: String,
      required: false,
      default: null,
    },
    summary: {
      type: String,
      required: true,
    },
    skills: {
      type: [String],
      required: true,
    },
    workExperience: {
      type: [
        {
          company: { type: String, required: false },
          profile: { type: String, required: false },
          location: { type: String, required: false },
          startDate: { type: Date, required: false },
          endDate: { type: Date, required: false },
        },
      ],
      required: false,
    },
    education: {
      type: [
        {
          degree: { type: String, required: false },
          institute: { type: String, required: false },
          location: { type: String, required: false },
          gpa: { type: String, required: false },
          year: { type: Date, required: false },
        },
      ],
      required: false,
    },
    projects: {
      type: [
        {
          name: { type: String, required: false },
          link: { type: String, required: false },
          description: { type: String, required: false },
        },
      ],
      required: false,
    },
    certifications: {
      type: [
        {
          instituteName: { type: String, required: false },
          link: { type: String, required: false },
          issuedDate: { type: Date, required: false },
          description: { type: String, required: false },
        },
      ],
      required: false,
    },
  },
  { timestamps: true }
);

export const resumeModel = mongoose.model("resume", blogSchema);
