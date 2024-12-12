import CustomErrorHandler from "../service/customErrorHandler.js";
import Joi from "joi";
import fs from "fs";
import { resumeModel } from "../models/resume.model.js";

export const resumeController = {
  addResume: async (req, res, next) => {
    const imageFile = req.files?.resumeImage?.[0];
    const {resumeImage} = req.body;
    const fileName = imageFile?.filename;
    const profileImageName = fileName ? fileName : resumeImage;
    console.log(profileImageName)
    const parsedWorkExperience = req.body.workExperience
      ? req.body.workExperience.map((item) => JSON.parse(item))
      : [];

    const parsedSkills = req.body.skills ? JSON.parse(req?.body?.skills) : [];

    const parsedEducation = req.body.education
      ? req.body.education.map((item) => JSON.parse(item))
      : [];

    const parsedProjects = req.body.projects
      ? req.body.projects.map((item) => JSON.parse(item))
      : [];

    const parsedCertifications = req.body.certifications
      ? req.body.certifications.map((item) => JSON.parse(item))
      : [];

    const resumeSchema = Joi.object({
      userId: Joi.string().required(),
      name: Joi.string().required(),
      profileImage: Joi.string().optional().allow("").allow(null),
      email: Joi.string().required(),
      phone: Joi.string().required(),
      github: Joi.string().optional().allow(""),
      linkedIn: Joi.string().optional().allow(""),
      summary: Joi.string().required(),
      skills: Joi.array().items(Joi.string()).required(),
      workExperience: Joi.array()
        .items(
          Joi.object({
            company: Joi.string().optional().allow(""),
            location: Joi.string().optional().allow(""),
            profile: Joi.string().optional().allow(""),
            startDate: Joi.string().optional().allow(""),
            endDate: Joi.string().optional().allow(""),
          })
        )
        .optional(),
      education: Joi.array()
        .items(
          Joi.object({
            degree: Joi.string().optional().allow(""),
            institute: Joi.string().optional().allow(""),
            year: Joi.string().optional().allow(""),
            gpa: Joi.string().optional().allow(""),
            location: Joi.string().optional().allow(""),
          })
        )
        .optional(),
      projects: Joi.array()
        .items(
          Joi.object({
            name: Joi.string().optional().allow(""),
            link: Joi.string().optional().allow(""),
            description: Joi.string().optional().allow(""),
          })
        )
        .optional(),

      certifications: Joi.array()
        .items(
          Joi.object({
            instituteName: Joi.string().optional().allow(""),
            link: Joi.string().optional().allow(""),
            issuedDate: Joi.string().optional().allow(""),
            description: Joi.string().optional().allow(""),
          })
        )
        .optional(),
    });

    console.log("bc")

    const { error } = resumeSchema.validate({
      ...req.body,
      profileImage:profileImageName,
      skills: parsedSkills,
      workExperience: parsedWorkExperience,
      education: parsedEducation,
      certifications: parsedCertifications,
      projects: parsedProjects,
    });

    console.log(error);

    if (error) {
      if (imageFile) {
        fs.unlink(`${appRoot}/${imageFile?.path}`, (error) => {
          if (error) {
            return next(CustomErrorHandler.serverError(error.message));
          }
        });
      }
      return next(error);
    }

    const { userId, name, phone, email, github, linkedIn, summary } = req.body;

    try {
      const resume = await resumeModel.create({
        userId,
        name,
        profileImage: fileName,
        phone,
        email,
        github,
        education: parsedEducation,
        linkedIn,
        summary,
        skills: parsedSkills,
        workExperience: parsedWorkExperience,
        projects: parsedProjects,
        certifications: parsedCertifications,
      });
      res
        .status(200)
        .json({ message: "Resume Details Added Successfully", data: resume });
    } catch (error) {
      console.log(error);
      return next(error);
    }
  },

  getResumes: async (req, res, next) => {
    const { userId } = req.body;
    try {
      if (userId) {
        const resumes = await resumeModel.find({ userId: userId });
        return res.json(resumes);
      } else {
        res.status(401).json({ message: "Resumes not found" });
      }
    } catch (error) {
      return next(error);
    }
  },

  getResumeDetails: async (req, res, next) => {
    const { userId, resumeId } = req.body;
    try {
      if (userId && resumeId) {
        const resume = await resumeModel.find({
          userId: userId,
          _id: resumeId,
        });
        return res.json(resume);
      } else {
        res.status(401).json({ message: "Resume not found" });
      }
    } catch (error) {
      return next(error);
    }
  },

  updateResume: async (req, res, next) => {
    const { userId, resumeId, resumeImage } = req.body;
    const imageFile = req.files?.resumeImage?.[0];
    const fileName = imageFile?.filename || "";
    const profileImageName = fileName ? fileName : resumeImage;
    const parsedWorkExperience = req.body.workExperience
      ? req.body.workExperience.map((item) => {
          const parsedItem = JSON.parse(item);
          delete parsedItem._id;
          return parsedItem;
        })
      : [];

    console.log(parsedWorkExperience);

    const parsedSkills = req.body.skills ? JSON.parse(req?.body?.skills) : [];

    const parsedEducation = req.body.education
      ? req.body.education.map((item) => {
          const parsedItem = JSON.parse(item);
          delete parsedItem._id; // Remove `_id` if present
          return parsedItem;
        })
      : [];

    const parsedProjects = req.body.projects
      ? req.body.projects.map((item) => {
          const parsedItem = JSON.parse(item);
          delete parsedItem._id; // Remove `_id` if present
          return parsedItem;
        })
      : [];

    const parsedCertifications = req.body.certifications
      ? req.body.certifications.map((item) => {
          const parsedItem = JSON.parse(item);
          delete parsedItem._id; // Remove `_id` if present
          return parsedItem;
        })
      : [];

    const resumeSchema = Joi.object({
      userId: Joi.string().required(),
      resumeId: Joi.string().required(),
      name: Joi.string().required(),
      profileImage: Joi.string().optional().allow(""),
      email: Joi.string().required(),
      phone: Joi.string().required(),
      github: Joi.string().optional().allow(""),
      linkedIn: Joi.string().optional().allow(""),
      summary: Joi.string().required(),
      skills: Joi.array().items(Joi.string()).required(),
      workExperience: Joi.array()
        .items(
          Joi.object({
            company: Joi.string().optional().allow(""),
            location: Joi.string().optional().allow(""),
            profile: Joi.string().optional().allow(""),
            startDate: Joi.string().optional().allow("").allow(null),
            endDate: Joi.string().optional().allow("").allow(null),
          })
        )
        .optional(),
      education: Joi.array()
        .items(
          Joi.object({
            degree: Joi.string().optional().allow(""),
            institute: Joi.string().optional().allow(""),
            year: Joi.string().optional().allow(""),
            gpa: Joi.string().optional().allow(""),
            location: Joi.string().optional().allow(""),
          })
        )
        .optional(),
      projects: Joi.array()
        .items(
          Joi.object({
            name: Joi.string().optional().allow(""),
            link: Joi.string().optional().allow(""),
            description: Joi.string().optional().allow(""),
          })
        )
        .optional(),

      certifications: Joi.array()
        .items(
          Joi.object({
            instituteName: Joi.string().optional().allow(""),
            link: Joi.string().optional().allow(""),
            issuedDate: Joi.string().optional().allow("").allow(null),
            description: Joi.string().optional().allow(""),
          })
        )
        .optional(),
    });

    const { error } = resumeSchema.validate({
      ...req.body,
      profileImage: profileImageName,
      skills: parsedSkills,
      workExperience: parsedWorkExperience,
      education: parsedEducation,
      certifications: parsedCertifications,
      projects: parsedProjects,
    });

    console.log(error);

    if (error) {
      if (imageFile) {
        fs.unlink(`${appRoot}/${imageFile?.path}`, (error) => {
          if (error) {
            return next(CustomErrorHandler.serverError(error.message));
          }
        });
        return next(error);
      }
    }

    const { name, phone, email, github, linkedIn, summary } = req.body;

    try {
      const updatedResume = await resumeModel.findOneAndUpdate(
        { userId, _id: resumeId },
        {
          name,
          profileImage: profileImageName,
          phone,
          email,
          github,
          education: parsedEducation,
          linkedIn,
          summary,
          skills: parsedSkills,
          workExperience: parsedWorkExperience,
          projects: parsedProjects,
          certifications: parsedCertifications,
        }
      );
      res.status(200).json({
        message: "Resume Update Successfully",
        data: updatedResume,
      });
    } catch (error) {
      console.log(error);
      return next(error);
    }
  },
};
