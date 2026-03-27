import { container } from 'tsyringe';
import { StudentsController } from 'Controller/StudentController';
import { StudentHomeworkController } from 'Controller/HomeworkStudentController';
import { StudentAttendanceController } from 'Controller/AttendanceController';
import { StripeController } from 'Controller/StripeController';

import {
  SchoolAcademicController,
  SchoolAcademicSubjectController,
  SchoolAcademicCourseController,
} from '../Controller/School.Acadmic.Controller';
import { TeacherController } from '../Controller/TeacherController';
import { NotificationController } from '../Controller/NotificatoinController';
import { FeeController } from '../Controller/FessController';
import { AddressController } from '../Controller/AddressController';
import { DocumentController } from '../Controller/DocumentController';
import { UserAuthController } from '../Controller/UserAuthControlller';
import { PasswordResetController } from '../Controller/ResetpasswordController';
import { SchoolController } from '../Controller/SchoolController';
import { CentersController } from '../Controller/CentersControllert';
import { BatchController } from '../Controller/BatchController';
import { HomeworkController } from '../Controller/HomeworkController';

export const addressController = container.resolve(AddressController);

export const documentController = container.resolve(DocumentController);

export const userAuthController = container.resolve(UserAuthController);

export const resetPassController = container.resolve(PasswordResetController);

export const schoolController = container.resolve(SchoolController);

export const centerController = container.resolve(CentersController);

export const batchController = container.resolve(BatchController);

export const schoolAcademicController = container.resolve(SchoolAcademicController);

export const schoolAcaSubController = container.resolve(SchoolAcademicSubjectController);

export const schoolAcaCourseController = container.resolve(SchoolAcademicCourseController);

export const teacherController = container.resolve(TeacherController);

export const notificationController = container.resolve(NotificationController);

export const feeController = container.resolve(FeeController);
export const homeworkController = container.resolve(HomeworkController);

export const studentController = container.resolve(StudentsController);
export const studentHomeworkController = container.resolve(StudentHomeworkController);
export const studentAttendanceController = container.resolve(StudentAttendanceController);
export const stripeController = container.resolve(StripeController);
