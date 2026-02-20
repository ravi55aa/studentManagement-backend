import mongoose, {Types,Schema, Document, ObjectId } from 'mongoose';

export interface IAcademicYear extends Document {
    code: string | null;
    year?:string|null
    startDate: Date | null;
    endDate: Date | null;
    status: string | null;
    tenantId: ObjectId | null;
    adminId:ObjectId|null
}

const academicYearSchema = new Schema<IAcademicYear>(
    {
        code: {
        type: String,
        required: true,
        uppercase: true,
        trim: true,
        },

        year: {
        type: String,
        required: true,
        match: /^\d{4}-\d{2}$/
        },
        startDate: {
        type: Date,
        required: true,
        },

        endDate: {
        type: Date,
        required: true,
        },

        status: {
        type: String,
        enum: ["active", "inactive"],
        default: "inactive",
        },

        tenantId: {
        type: Types.ObjectId,
        ref: "School",
        required: true,
        },

        adminId: {
        type: Types.ObjectId,
        ref: "Admin",
        required: true,
        },
    },
    {
        timestamps: true,
    }
);

/* ---------- Indexes ---------- */
academicYearSchema.index(
    { tenantId: 1, code: 1 },
    { unique: true }
);


export const academicYearModel = 
    mongoose.model<IAcademicYear>('AcademicYear', academicYearSchema);




export interface IAcademicSubject extends Document {
    name: string;
    code: string;
    className: string;
    type: "theory" | "practical" | "both";

    maxMarks: number;
    passMarks?: number;

    tenantId: ObjectId;
    adminId: ObjectId;
    academicYear: ObjectId;

    description: string;
    department?: string;

    batchesToFollow: Types.ObjectId[];

    credits?: number;
    level?: "primary" | "secondary" | "higher-secondary" | "degree" |null;

    referenceBooks?: string[]; // URLs
    syllabusUrl?: string;

    status?: "active" | "inactive";

    createdAt: Date;
    updatedAt: Date;
}



const AcademicSubjectsSchema = new Schema<IAcademicSubject>(
    {
        name: {
        type: String,
        required: true,
        trim: true,
        },

        code: {
        type: String,
        required: true,
        uppercase: true,
        trim: true,
        },

        className: {
        type: String,
        required: true,
        trim: true,
        },

        type: {
        type: String,
        enum: ["theory", "practical", "both"],
        required: true,
        },

        maxMarks: {
        type: Number,
        required: true,
        min: 1,
        },

        passMarks: {
        type: Number,
        min: 0,
        },

        tenantId: {
        type: Types.ObjectId,
        ref: "School",
        required: true,
        },

        adminId: {
        type: Types.ObjectId,
        ref: "Admin",
        required: true,
        },

        academicYear: {
        type: Types.ObjectId,
        ref: "AcademicYear",
        required: true,
        },

        description: {
        type: String,
        required: true,
        trim: true,
        },

        department: {
        type: String,
        trim: true,
        },

        batchesToFollow: [
        {
            type: Types.ObjectId,
            ref: "Batch",
            required: true,
        },
        ],

        credits: {
        type: Number,
        min: 0,
        },

        level: {
        type: String,
        enum: ["primary", "secondary", "higher-secondary", "degree",null],
        default:null
        },

        syllabusUrl: {
        type: String,
        trim: true,
        },

        referenceBooks: [
        {
            type: String,
            trim: true,
        },
        ],

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




AcademicSubjectsSchema.index(
    { schoolId: 1, academicYear: 1, code: 1 },
    { unique: true }
);

const academicSubjectsModel = mongoose.model<IAcademicSubject>('AcademicSubjects', AcademicSubjectsSchema);

export default academicSubjectsModel;

