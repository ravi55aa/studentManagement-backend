import mongoose, { Schema, Document, ObjectId, Types } from 'mongoose';

import { EmploymentStatus, TeacherDesignation, EDepartment, Gender_types } from '../types/enum';

import { IAcademicSubject } from './academicYear';
import { IUploadedDoc } from './documentModel';

export interface ITeacherBio extends Document {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  qualification: string | null;
  dateOfBirth: Date | null;
  profilePhoto: string | null;
  experience: number | null;
  gender: Gender_types;
  documents: IUploadedDoc[];
  tenantId: ObjectId | null;
}

const TeacherBioSchema: Schema = new Schema(
  {
    phone: {
      type: String,
      required: true,
      match: [/^[6-9]\d{9}$/, 'Invalid phone number'],
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email address'],
      index: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    lastName: {
      type: String,
      trim: true,
      minlength: 1,
      maxlength: 50,
      default: '',
    },
    qualification: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    profilePhoto: {
      type: String,
      trim: true,
      default: null,
    },
    experience: {
      type: Number,
      min: 0,
      max: 50,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true,
    },
    documents: [
      {
        fileName: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: 'School',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const teacherBioModel = mongoose.model<ITeacherBio>('TeacherBio', TeacherBioSchema);

/**
 * Teacher additional details
 */

export interface ITeacher {
  teacherId: Types.ObjectId | null;
  academicYearId: Types.ObjectId | null;
  employeeId: string | null;
  employmentStatus: EmploymentStatus | null;
  assignedSubjects: IAcademicSubject[];
  designation: TeacherDesignation | null;
  department: EDepartment[] | null;
  dateOfLeaving?: Date | null;
  dateOfJoining: Date | null;
  center: ObjectId | null;
  modelType: 'School' | 'Centers';
}

const TeacherSchema: Schema = new Schema(
  {
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: 'TeacherBio',
      required: false,
      default: null,
    },

    academicYearId: { type: Schema.Types.ObjectId, ref: 'AcademicYear' },
    employeeId: { type: String, required: true, unique: true },

    employmentStatus: {
      type: String,
      enum: ['active', 'inactive', 'on_leave', 'resigned', 'terminated'],
      required: true,
      default: 'active',
    },

    assignedSubjects: [{ type: Schema.Types.ObjectId, ref: 'AcademicSubjects', required: true }],

    designation: {
      type: String,
      enum: ['teacher', 'head_of_department', 'assistant_teacher', 'head_Master'],
    },

    department: [
      {
        type: String,
        enum: [
          'mathematics',
          'science',
          'english',
          'social science',
          'languages',
          'computer science',
          'physical education',
          'arts',
        ],
      },
    ],
    dateOfJoining: { type: Date, required: true },
    dateOfLeaving: { type: Date, default: null },
    modelType: {
      type: String,
      enum: ['School', 'Centers'],
      default: 'School',
    },
    center: {
      type: Schema.Types.ObjectId,
      refPath: 'modelType',
      required: true,
    },
  },
  { timestamps: true },
);

const Teacher = mongoose.model<ITeacher>('Teacher', TeacherSchema);

export default Teacher;
