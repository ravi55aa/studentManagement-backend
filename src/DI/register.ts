import { container } from 'tsyringe';
import { UserAuthServiceV2,UserAuthService } from '@Services/userAuthService';
import { StudentRepository } from '@Repository/Student/studentRepostiroy';
import { StudentService } from '@Services/Student/StudentService';
import { StudentHomeworkRepository } from '@Repository/Student/homeworkStudentRepository';
import { StudentHomeworkService } from '@Services/Student/studentHomeworkService';
import { StudentAttendanceService } from '@Services/Student/attendanceService';
import { StudentAttendanceRepository } from '@Repository/Student/attendanceRepository';
import { StripeService } from '@Services/stripeService';
import { StudentFeeRepository } from '@Repository/stripeRepository';
import { ChatAccessService, ChatMessageService, ChatRoomService } from '@Services/chatService';
import { ChatMessageRepository, ChatRoomRepository } from '@Repository/chatRepository';
import { SocketService } from '@Services/Socket/SocketService';
import { PlanService } from '@Services/Admin/PlanService';
import { PlanRepository } from '@Repository/Admin/PlanRepository';
import { AddressService } from '@Services/addressService';
import { DocumentRepository } from '@Repository/documentRepository';
import { DocumentService } from '@Services/documentService';
import { SuperAdminRepository, UserRepository } from '@Repository/userRepository';
import { TeacherService } from '@Services/teacherService';
import { TeacherRepository } from '@Repository/teacherRepo';
import { NotificationRepo } from '@Repository/notificationRepo';
import { NotificationService } from '@Services/notificationService';
import { FeeService } from '@Services/feesService';
import { FeeRepository } from '@Repository/feeRepository';
import { SchoolRepository } from '@Repository/schoolRepository';
import { SchoolService } from '@Services/schoolService';
import { CenterRepository } from '@Repository/centerRepository';
import { CentersService } from '@Services/centersService';
import { BatchRepository } from '@Repository/batchRespository';
import { BatchService } from '@Services/batchService';
import {
  AcademicCourseRepository,
  AcademicSubjectRepository,
  AcademicYearRepository,
} from '@Repository/academicYear.Respository';
import {
  SchoolYear,
  SchoolAcademicCoursesService,
  SchoolAcademicSubjectSer,
} from '@Services/school.year.service';
import { ForgotPasswordService } from '@Services/forgotPassword.service';
import { ForgotPasswordRepository } from '@Repository/forgotPassword.Repository';
import { AddressRepository } from '@Repository/addressRepository';
import { HomeworkRepository } from '@Repository/Teacher/homework.Repository';
import { HomeworkService } from '@Services/Teacher/homeworkService';

import { TYPES } from './types';

container.registerSingleton(TYPES.AddressRepository, AddressRepository);
container.registerSingleton(TYPES.AddressService, AddressService);

container.registerSingleton(TYPES.StripeRepository,StudentFeeRepository );
container.registerSingleton(TYPES.StripeService, StripeService);

container.registerSingleton(TYPES.DocumentRepository, DocumentRepository);
container.registerSingleton(TYPES.DocumentService, DocumentService);

container.registerSingleton(TYPES.UserRepository, UserRepository);
container.registerSingleton(TYPES.UserAuthService, UserAuthService);
container.registerSingleton(TYPES.UserAuthService2, UserAuthServiceV2);

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

/* ================= Notification ================= */
container.registerSingleton(TYPES.NotificationRepository, NotificationRepo);

container.registerSingleton(TYPES.NotificationService, NotificationService);

/* ================= Fee ================= */

container.registerSingleton(TYPES.FeeRepository, FeeRepository);

container.registerSingleton(TYPES.FeeService, FeeService);

/* ================= Forgot Password ================= */
container.registerSingleton(TYPES.ForgotPasswordRepository, ForgotPasswordRepository);

container.registerSingleton(TYPES.ForgotPasswordService, ForgotPasswordService);

/* ================= Teacher ================= */

container.registerSingleton(TYPES.TeacherRepository, TeacherRepository);

container.registerSingleton(TYPES.TeacherService, TeacherService);
/* Homework */
container.registerSingleton(TYPES.HomeworkRepository, HomeworkRepository);

container.registerSingleton(TYPES.HomeworkService, HomeworkService);

/* ================= Student ================= */
container.registerSingleton(TYPES.StudentRepository, StudentRepository);

container.registerSingleton(TYPES.StudentService, StudentService);
/* Homework */
container.registerSingleton(TYPES.StudentHomeworkRepository, StudentHomeworkRepository);

container.registerSingleton(TYPES.StudentHomeworkService, StudentHomeworkService);

/* Attendance */
container.registerSingleton(TYPES.StudentAttendanceService, StudentAttendanceService);

container.registerSingleton(TYPES.StudentAttendanceRepository, StudentAttendanceRepository);


/* ================= ADMIN ================= */
//subscription plan
container.registerSingleton(TYPES.PlanService, PlanService);
container.registerSingleton(TYPES.PlanRepository, PlanRepository);

container.registerSingleton(TYPES.SuperAdminRepository, SuperAdminRepository);


/* ================= OTHER ================= */
/* CHAT */
//room
container.registerSingleton(TYPES.ChatRoomService, ChatRoomService);
container.registerSingleton(TYPES.ChatRoomRepository, ChatRoomRepository);
//message
container.registerSingleton(TYPES.ChatMessageService, ChatMessageService);
container.registerSingleton(TYPES.ChatMessageRepository, ChatMessageRepository);
//access
container.registerSingleton(TYPES.ChatAccessService, ChatAccessService);

//socket
container.registerSingleton(TYPES.SocketService, SocketService);