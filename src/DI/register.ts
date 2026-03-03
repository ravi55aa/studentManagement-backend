import { container } from 'tsyringe';

import { AddressService } from '../Services/addressService';
import { DocumentRepository } from '../Repository/documentRepository';
import { DocumentService } from '../Services/documentService';
import { UserRepository } from '../Repository/userRepository';
import { UserAuthService } from '../Services/userAuthService';
import { TeacherService } from '../Services/teacherService';
import { TeacherRepository } from '../Repository/teacherRepo';
import { NotificationRepo } from '../Repository/notificationRepo';
import { NotificationService } from '../Services/notificationService';
import { FeeService } from '../Services/feesService';
import { FeeRepository } from '../Repository/feeRepository';
import { SchoolRepository } from '../Repository/schoolRepository';
import { SchoolService } from '../Services/schoolService';
import { CenterRepository } from '../Repository/centerRepository';
import { CentersService } from '../Services/centersService';
import { BatchRepository } from '../Repository/batchRespository';
import { BatchService } from '../Services/batchService';
import {
  AcademicCourseRepository,
  AcademicSubjectRepository,
  AcademicYearRepository,
} from '../Repository/academicYear.Respository';
import {
  SchoolYear,
  SchoolAcademicCoursesService,
  SchoolAcademicSubjectSer,
} from '../Services/school.year.service';
import { ForgotPasswordService } from '../Services/forgotPassword.service';
import { ForgotPasswordRepository } from '../Repository/forgotPassword.Repository';
import { AddressRepository } from '../Repository/addressRepository';

import { TYPES } from './types';

container.registerSingleton(TYPES.AddressRepository, AddressRepository);

container.registerSingleton(TYPES.AddressService, AddressService);

container.registerSingleton(TYPES.DocumentRepository, DocumentRepository);

container.registerSingleton(TYPES.DocumentService, DocumentService);

container.registerSingleton(TYPES.UserRepository, UserRepository);

container.registerSingleton(TYPES.UserAuthService, UserAuthService);

container.registerSingleton(TYPES.SchoolRepository, SchoolRepository);

container.registerSingleton(TYPES.SchoolService, SchoolService);

container.registerSingleton(TYPES.CenterRepository, CenterRepository);

container.registerSingleton(TYPES.CenterService, CentersService);

container.registerSingleton(TYPES.BatchRepository, BatchRepository);

container.registerSingleton(TYPES.BatchService, BatchService);

/* ================= Academic Repositories ================= */

container.registerSingleton(TYPES.AcademicCourseRepository, AcademicCourseRepository);

container.registerSingleton(TYPES.AcademicSubjectRepository, AcademicSubjectRepository);

container.registerSingleton(TYPES.AcademicYearRepository, AcademicYearRepository);

/* ================= Academic Services ================= */

container.registerSingleton(TYPES.SchoolYearService, SchoolYear);

container.registerSingleton(TYPES.SchoolAcademicCoursesService, SchoolAcademicCoursesService);

container.registerSingleton(TYPES.SchoolAcademicSubjectService, SchoolAcademicSubjectSer);

/* ================= Teacher ================= */

container.registerSingleton(TYPES.TeacherRepository, TeacherRepository);

container.registerSingleton(TYPES.TeacherService, TeacherService);

/* ================= Notification ================= */

container.registerSingleton(TYPES.NotificationRepository, NotificationRepo);

container.registerSingleton(TYPES.NotificationService, NotificationService);

/* ================= Fee ================= */

container.registerSingleton(TYPES.FeeRepository, FeeRepository);

container.registerSingleton(TYPES.FeeService, FeeService);

/* ================= Forgot Password ================= */
container.registerSingleton(TYPES.ForgotPasswordRepository, ForgotPasswordRepository);

container.registerSingleton(TYPES.ForgotPasswordService, ForgotPasswordService);
