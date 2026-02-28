import { container } from 'tsyringe';

import { SchoolAcademicController , SchoolAcademicSubjectController , SchoolAcademicCourseController } from './Controller/School.Acadmic.Controller';
import { TeacherController } from './Controller/TeacherController';
import { NotificationController } from './Controller/NotificatoinController';
import { FeeController } from './Controller/FessController';
import { AddressController } from './Controller/AddressController';
import { DocumentController } from './Controller/DocumentController';
import { UserAuthController } from './Controller/UserAuthControlller';
import { PasswordResetController } from './Controller/Resetpassword.controller';
import { SchoolController } from './Controller/SchoolAdd.Controller';
import { CentersController } from './Controller/CentersControllert';
import { BatchController } from './Controller/BatchController';

export const addressController = container.resolve(AddressController);

export const documentController = container.resolve(DocumentController);

export const userAuthController = container.resolve(UserAuthController);

export const resetPassController = container.resolve(PasswordResetController);

export const schoolController = container.resolve(SchoolController);

export const centerController = container.resolve(CentersController);

export const batchController = container.resolve(BatchController);

/**
 * school Academic Year
 */
export const schoolAcademicController = container.resolve(SchoolAcademicController);

/**
 * school Academic Subject
 */
export const schoolAcaSubController = container.resolve(SchoolAcademicSubjectController);

/**
 * school Academic Course
 */
export const schoolAcaCourseController = container.resolve(SchoolAcademicCourseController);

/**
 * TEACHER
 */
export const teacherController = container.resolve(TeacherController);

/**
 * Notification
 */
export const notificationController = container.resolve(NotificationController);

/**
 * FEE ADDING
 * */
export const feeController = container.resolve(FeeController);
