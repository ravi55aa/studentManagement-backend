import mongoose, { Types, Schema, Document, ObjectId } from 'mongoose';

import { IUploadedDoc } from './documentModel';

export interface IAcademicCourse extends Document {
  name: string | null;
  tenantId: ObjectId | null;
  academicYear: ObjectId | Types.ObjectId | null;
  code: string | null;
  description: string | null;
  //level: String | null;
  duration: {
    value: string | null;
    unit: string | null;
  };
  schedule: {
    endDate: Date | null;
    startDate: Date | null;
  };
  adminId: ObjectId | null;
  status: string | null;
  modelType: 'School' | 'Centers';
  center: ObjectId;
}

const AcademicCoursesSchema = new Schema<IAcademicCourse>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    code: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      index: true,
    },

    description: {
      type: String,
      trim: true,
    },

    // level: {
    //     type: String,
    //     enum: ["school", "bachelors", "masters", "certificate"],
    //     required: true,
    // },

    schedule: {
      startDate: {
        type: Date,
        default: null,
      },
      endDate: {
        type: Date,
        default: null,
      },
    },

    duration: {
      value: {
        type: Number,
        required: true,
        min: 1,
      },
      unit: {
        type: String,
        enum: ['hours', 'months', 'years'],
        required: true,
      },
    },

    academicYear: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicYear',
      required: true,
      index: true,
    },

    tenantId: {
      type: Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true,
    },

    adminId: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
    },

    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
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
  {
    timestamps: true,
  },
);

const coursesModel = mongoose.model<IAcademicCourse>('AcademicCourses', AcademicCoursesSchema);

export default coursesModel;

/******************** COURSES_META {BOOKS,References,teachers,etc...} *********************/

enum SubjectType {
  ACADEMIC = 'ACADEMIC',
  CUSTOM = 'CUSTOM',
}

export interface ICourseSubjects {
  subjectType: SubjectType | null;
  subjectRef: Types.ObjectId[] | null;
  customSubjectName: string[] | null;
}

export interface IAcademicCourseMeta extends Document {
  subjects: ICourseSubjects[] | null;
  coordinators: ObjectId[] | null;
  eligibilityCriteria: string | null;
  attachments: IUploadedDoc[];
  classes: string[] | null;
  syllabusUrl?: string | null;
  maxStudents: string | null;
  courseId: Types.ObjectId | null;
  enrollmentOpen: boolean | null;
}

const AcademicCourseMetaSchema = new Schema<IAcademicCourseMeta>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicCourse',
      required: true,
      index: true,
      unique: true, // one meta per course
    },

    subjects: [
      {
        subjectType: {
          type: String,
          enum: ['ACADEMIC', 'CUSTOM'],
          required: true,
        },

        subjectRef: [
          {
            type: Schema.Types.ObjectId,
            ref: 'AcademicSubjects',
          },
        ],

        customSubjectName: [
          {
            type: String,
          },
        ],
      },
    ],

    coordinators: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Users', // or Teachers/Admins,
        required: false, //till i add the
      },
    ],

    eligibilityCriteria: {
      type: String,
      trim: true,
      default: 'Must be a valid student ',
    },

    attachments: [
      {
        fileName: {
          type: String,
          trim: true,
        },
        fileUrl: {
          type: String,
          trim: true,
        },
      },
    ],

    classes: {
      type: [String],
      enum: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    },

    syllabusUrl: {
      type: String,
      trim: true,
      required: false,
    },

    maxStudents: {
      type: Number,
      min: 1,
    },

    enrollmentOpen: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export const coursesMetaModel = mongoose.model<IAcademicCourseMeta>(
  'AcademicCourseMeta',
  AcademicCourseMetaSchema,
);
