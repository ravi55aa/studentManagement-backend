import mongoose, { Types,Schema, Document, ObjectId } from 'mongoose';

export interface IAcademicCourse extends Document {
    name: String | null;
    tenantId: ObjectId | null;
    academicYear: ObjectId | Types.ObjectId|null;
    code: String | null;
    description: String | null;
    //level: String | null;
    duration: {
        value: String | null;
        unit: String | null;
    };
    schedule: {
        endDate: Date | null;
        startDate: Date | null;
    };
    adminId: ObjectId | null;
    status: String | null;
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
                enum: ["hours", "months", "years"],
                required: true,
            },
        },

        academicYear: {
            type: Schema.Types.ObjectId,
            ref: "AcademicYear",
            required: true,
            index: true,
        },

        tenantId: {
            type: Schema.Types.ObjectId,
            ref: "School",
            required: true,
            index: true,
        },

        adminId: {
            type: Schema.Types.ObjectId,
            ref: "Admin",
            required: true,
        },

        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
    },
    {
        timestamps: true,
    }
);


const coursesModel = mongoose.model<IAcademicCourse>('AcademicCourses', AcademicCoursesSchema);

export default coursesModel;



/******************** COURSES_META {BOOKS,References,teachers,etc...} *********************/

export interface IUpload_document {
                fileName:String; 
                fileUrl:String
    }

enum SubjectType{
    ACADEMIC="ACADEMIC",
    CUSTOM="CUSTOM"
}

export interface ICourseSubjects{
    subjectType:SubjectType|null;
    subjectRef:Types.ObjectId[]|null;
    customSubjectName:String[]|null;
}


export interface IAcademicCourseMeta extends Document {
    subjects: ICourseSubjects[] | null ;
    coordinators: ObjectId[] | null;
    eligibilityCriteria: String | null;
    attachments: IUpload_document[];
    batches: Types.ObjectId[] | null;
    syllabusUrl?: String | null;
    maxStudents: String | null;
    courseId: Types.ObjectId | null;
    enrollmentOpen: String | null;
}


const AcademicCourseMetaSchema = new Schema<IAcademicCourseMeta>(
    {
        courseId: {
        type: Schema.Types.ObjectId,
        ref: "AcademicCourse",
        required: true,
        index: true,
        unique: true, // one meta per course
        },

        subjects: [
            {
                subjectType: {
                type: String,
                enum: ["ACADEMIC", "CUSTOM"],
                required: true
                },

                subjectRef: [{
                type: Schema.Types.ObjectId,
                ref: "AcademicSubjects"
                }],

                customSubjectName: [{
                type: String
                }]
            }
        ],


        coordinators: [
        {
            type: Schema.Types.ObjectId,
            ref: "Users", // or Teachers/Admins,
            required:false //till i add the 
        },
        ],

        eligibilityCriteria: {
            type: String,
            trim: true,
            default:"Must be a valid student "
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

        batches: [
            {
                type: Schema.Types.ObjectId,
                ref: "Batches",
            },
        ],

        syllabusUrl: {
            type: String,
            trim: true,
            required:false
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
    }
);


export const coursesMetaModel = 
    mongoose.model<IAcademicCourseMeta>('AcademicCourseMeta', AcademicCourseMetaSchema);



