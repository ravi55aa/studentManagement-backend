import { container } from 'tsyringe';
import {
  SchoolAcademicController,
  SchoolAcademicSubjectController,
  SchoolAcademicCourseController,
} from 'Controller/School.Acadmic.Controller';
import { PlanController,
  AddressController,
  StudentsController,
  StudentHomeworkController,
  StudentAttendanceController,
  StripeController,
  ChatController,
  TeacherController,
  NotificationController,
  FeeController,
  DocumentController,
  UserAuthController,
  PasswordResetController,
  SchoolController,
  CentersController,
  BatchController,
  HomeworkController,
  } from 'Controller';


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

export const chatController = container.resolve(ChatController);

export const planController = container.resolve(PlanController);
