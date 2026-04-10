/**
 * General success messages for API responses
 */
export enum GeneralMessage {
  // Success messages
  DataReturned = 'Data returned',
}

/**
 * Authentication and authorization related messages
 */
export enum AuthMessage {
  // Error messages
  EmailExists = 'User with email already exists',
  OtpExpired = 'OTP is expired',
  InvalidOtp = 'Invalid OTP',
  OtpNotVerified = 'OTP is not verified',
  InvalidCredentials = 'Invalid credentials',
  UserBlocked = 'Blocked',
  InvalidRefreshToken = 'Invalid refresh token',
  InvalidAccessToken = 'Invalid token',
  NoAccess = 'You have no access',
  InvalidCurrentPassword = 'Current password is invalid',
  passwordNotUpdated = 'Password not updated',
  InvalidUser = 'Invalid user type',

  // Success messages
  OTPResent = 'OTP resent',
  not_Found = 'User not found',
  RegisterOtpSent = 'OTP sent to your email, verify to complete registration',
  UserRegistered = 'New user created',
  UserLoggedIn = 'Login successful',
  UserLoggedOut = 'User is logged out',
  ForgetPasswordOtpSent = 'OTP sent to your email, verify to reset password',
  OtpVerified = 'OTP is verified',
  PasswordReset = 'Password is updated',
  TokenRefreshed = 'Token refreshed',
}

export enum SchoolMessage {
  NotFound = 'School not found, credentials miss match',
  NotUpdated = 'School Not updated',
  NotDeleted = 'School not deleted',

  SchoolListed = 'School Listed Successfully',
  Updated = 'School updated',
  FetchAll = 'Listed All School',
  Deleted = 'School deleted successfully',
}

export enum AcademicCourseMessage {
  // Errors
  InvalidCourseId = 'Invalid course ID',
  CourseCreateFailed = 'Failed to create course',
  CourseMetaCreateFailed = 'Failed to create course metadata',
  CourseNotFound = 'Academic course not found',
  NoCoursesFound = 'No academic courses found',

  AcademicYearNotFound = 'Academic year not found',
  SubjectNotFound = 'One or more subjects not found',

  // Success
  CourseCreated = 'Academic course created successfully',
  CoursesListed = 'Academic courses fetched successfully',
  CourseFetched = 'Academic course fetched successfully',
  CourseDeleted = 'Academic course deleted successfully',
  CourseUpdated = 'Academic course updated successfully',
}

export enum AcademicSubjectMessage {
  // Errors
  InvalidSubjectId = 'Invalid subject ID',
  SubjectNotFound = 'Academic subject not found',
  SubjectCreateFailed = 'Failed to create subject',
  SubjectUpdateFailed = 'Failed to update subject',
  SubjectDeleteFailed = 'Failed to delete subject',
  NoSubjectsFound = 'No academic subjects found',

  // Success
  SubjectCreated = 'Academic subject created successfully',
  SubjectUpdated = 'Academic subject updated successfully',
  SubjectDeleted = 'Academic subject deleted successfully',
  SubjectFetched = 'Academic subject fetched successfully',
  SubjectsListed = 'Academic subjects fetched successfully',
}

export enum AdminMessage {
  NotFound = 'Admin not found',
}

export enum AcademicYearMessage {
  // Errors
  InvalidYearId = 'Invalid academic year ID',
  YearNotFound = 'Academic year not found',
  YearCreateFailed = 'Failed to create academic year',
  YearUpdateFailed = 'Failed to update academic year',
  YearDeleteFailed = 'Failed to delete academic year',
  NoYearsFound = 'No academic years found',

  // Success
  YearCreated = 'Academic year created successfully',
  YearUpdated = 'Academic year updated successfully',
  YearDeleted = 'Academic year deleted successfully',
  YearFetched = 'Academic year fetched successfully',
  YearsListed = 'Academic years fetched successfully',
}

/**
 * User profile and account related messages
 */
export enum UserMessage {
  // Error messages
  UserNotFound = 'User not found',
  NoProfileImage = 'Profile image is not given',
  UserNotCreated = 'User not created',

  // Success messages
  ProfileImageUpdated = 'Profile image is updated',
  ProfileUpdated = 'Profile updated',
  UserBlocked = 'User blocked',
  UserUnblocked = 'User unblocked',
}

/**
 * Category management related messages
 */
export enum CategoryMessage {
  // Error messages
  CategoryExists = 'Category already exists',
  CategoryNotFound = 'Category not found',

  // Success messages
  CategoryAdded = 'New category created',
  CategoryUpdated = 'Category updated',
  CategoryListed = 'Category has been listed',
  CategoryUnlisted = 'Category has been unlisted',
}

/**
 * Category management related messages
 */
export enum DocumentMessage {
  // Error
  DocumentNotFound = 'Document not found',
  DocumentUploadFailed = 'Failed to upload document',
  DocumentUpdateFailed = 'Failed to update document',
  FileNotFound = 'File not found in document',

  // Success
  DocumentCreated = 'Document Created successfully',
  DocumentFetched = 'Document fetched successfully',
  DocumentUploaded = 'Document uploaded successfully',
  DocumentUpdated = 'Document updated successfully',
  DocumentDeleted = 'Document deleted successfully',
  FileDeleted = 'File deleted successfully',
}

export enum CommonMessage {
  IdNotFound = 'Id not found',
  EmailNotFound = 'Email not found',
}

/**
 * Address  related messages
 */
export enum AddressMessage {
  // Error
  AddressNotFound = 'Address not found',
  AddressCreateFailed = 'Failed to create address',
  AddressIdNotFound = 'ID not found',
  AddressNotUpdated = 'Address not updated',

  // Success
  AddressCreated = 'Address created successfully',
  AddressUpdated = 'Address updated successfully',
  AddressFetched = 'Address fetched successfully',
  AddressListed = 'Addresses fetched successfully',
}
/**
 * Course management and enrollment related messages
 */
export enum CourseMessage {
  // Error messages
  CourseExists = 'Course with the same title already exists',
  CourseNotFound = 'Course not found',
  NoCourseAccess = 'You have no access to this course',
  CourseNoThumbnail = 'Course thumbnail not added',

  // Success messages
  CourseCreated = 'New course created',
  ThumbnailUpdated = 'Course thumbnail changed',
  BasicDetailsUpdated = 'Basic details updated',
  RequirementsUpdated = 'Course requirements updated',
  SkillsCoveredUpdated = 'Course skills covered updated',
  CourseEnrolled = 'Course enrolled',
  CourseOrderCreated = 'Order created',
  CourseAccessGranted = 'Course access granted',
  CourseListed = 'Course has been listed',
  CourseUnlisted = 'Course has been unlisted',
  CourseApproved = 'Course has been approved',
  CourseRejected = 'Course has been rejected',
  CourseAlreadyEnrolled = 'User is already enrolled in this course',
}

/**
 * Module management related messages
 */
export enum ModuleMessage {
  // Success messages
  ModuleAdded = 'New module added',
  ModuleDeleted = 'Module deleted',
  ModuleTitleChanged = 'Module title changed',
}

/**
 * Lesson management and file upload related messages
 */
export enum LessonMessage {
  // Error messages
  NoFile = 'File is required',

  // Success messages
  LessonDetailsUpdated = 'Lesson details updated',
  LessonFileUpdated = 'Lesson file has been updated',
  LessonCompleted = 'Lesson completed',
  LessonNotCompleted = 'Lesson not completed',
  LessonAdded = 'New lesson added',
  LessonDeleted = 'Lesson deleted',
}

/**
 * Subscription and access control related messages
 */
export enum SubscriptionMessage {
  // Error messages
  NotSubscribed = 'You are not subscribed',
  SubscriptionExpired = 'Subscription has expired',

  // Success messages
  SubscriptionAdded = 'Subscription added',
}

/**
 * Review and reply related messages
 */
export enum ReviewMessage {
  //Error messages
  ReviewedAlready = 'Already reviewed cannot review',
  NotEnrolledCourse = 'You must enroll the course to add review',

  // Success messages
  ReviewAdded = 'Review has been added',
  ReviewDeleted = 'Review has been deleted',
  ReplyAdded = 'Reply has been added',
  ReviewUpdated = 'Review has been updated',
}

/**
 * Trainer request and approval related messages
 */
export enum TrainerRequestMessage {
  // Success messages
  TrainerRequestSent = 'Trainer request has been sent',
  RequestApproved = 'Request has been approved',
  RequestRejected = 'Request has been rejected',
}

/**
 *  STRIPE MESSAGES 
 */
export enum StripeMessage {
  // Error
  PaymentIntentCreationFailed = 'Failed to create payment intent',
  PaymentFailed = 'Payment failed',
  WebhookSignatureInvalid = 'Invalid webhook signature',
  WebhookProcessingFailed = 'Failed to process webhook',
  PaymentNotFound = 'Payment not found',
  MetadataMissing = 'Required metadata missing',

  // Success
  PaymentIntentCreated = 'Payment intent created successfully',
  PaymentSuccess = 'Payment completed successfully',
  PaymentStatusUpdated = 'Payment status updated successfully',
  WebhookReceived = 'Webhook received successfully',
}


/**
 * Chat response messages
 */
export enum ChatMessage {
  //Success messages
  MediaSent = 'Media Sent',
  NewChat = 'New chat created',
}

/**
 * Wishlist management response messages
 */
export enum WishlistMessage {
  //Success messages
  courseAdded = 'Course added to wishlist',
  courseRemoved = 'Course removed to wishlist',
}

export enum HomeworkMessage {
  //Success messages
  HomeworkAdded = 'Homework added',
  HomeworkSubmitted = 'Homework submitted',
  HomeworkGraded = 'Homework graded',
  HomeworkUngraded = 'Homework ungraded',
  HomeworkReSubmitted = 'Homework resubmitted',
  HomeworkNotUpdated = 'Homework not updated',
  HomeworkSubmissionNotFound = 'No Homework submission',

  HomeworkCreated = 'Homework created successfully',
  HomeworkUpdated = 'Homework updated successfully',
  HomeworkDeleted = 'Homework deleted successfully',
  HomeworkFetched = 'Homework fetched successfully',
  HomeworkListed = 'Homework list fetched successfully',
  HomeworkNotFound = 'Homework not found',
}

export enum DiscussionMessage {
  //Success messages
  DiscussionAdded = 'Discussion added',
  DiscussionDeleted = 'Discussion deleted',
  DiscussionUpdated = 'Discussion updated',
  ReplyAdded = 'Reply has been added',
}

export enum TopicMessage {
  //Error Messages
  TopicExists = 'Topic already exists',
  TopicNotFound = 'Topic not found',
  //Success Messages
  TopicAdded = 'Topic added',
  TopicUpdated = 'Topic updated',
}

export enum FeesMessage {
  // Error messages
  FeesExists = 'Fees record already exists',
  FeesNotFound = 'Fees record not found',
  FeesIdNotFound = 'Fees Id not found',
  FeesCodeExist = 'Fees code already exist',

  // Success messages
  FeesAdded = 'New fees record created',
  FeesUpdated = 'Fees record updated',
  FeesListed = 'Fees record has been listed',
  FeesUnlisted = 'Fees record has been unlisted',
  FeesDeleted = 'Fees deleted successfully',
}

export enum BatchMessage {
  // ======================
  // Error Messages
  // ======================
  BatchExists = 'Batch already exists',
  BatchNotFound = 'Batch not found',
  BatchCreateFailed = 'Failed to create batch',
  BatchUpdateFailed = 'Failed to update batch',
  BatchDeleteFailed = 'Failed to delete batch',

  BatchAlreadyHasTeacher = 'Batch already has a class teacher',
  BatchTeacherNotFound = 'Batch class teacher not found',
  TeacherAlreadyAssigned = 'Teacher is already assigned to another batch',

  // ======================
  // Success Messages
  // ======================
  BatchAdded = 'New batch created successfully',
  BatchUpdated = 'Batch updated successfully',
  BatchDeleted = 'Batch deleted successfully',
  BatchFetched = 'Batch fetched successfully',
  BatchListed = 'Batches fetched successfully',
  BatchUnlisted = 'Batch has been unlisted',
  TeacherAssigned = 'Teacher assigned successfully',
}

export enum StudentMessage {
  // ======================
  // Error Messages
  // ======================

  StudentExists = 'Student already exists',
  StudentNotFound = 'Student not found',
  StudentNotUpdated = 'Student not updated',
  StudentIdNotFound = 'Student ID not provided',

  InvalidStudentId = 'Invalid student ID',
  InvalidStudentEmail = 'Invalid student email',

  StudentCreateFailed = 'Failed to create student',
  StudentUpdateFailed = 'Failed to update student',
  StudentDeleteFailed = 'Failed to delete student',

  AdmissionNumberExists = 'Admission number already exists',

  BatchNotFound = 'Batch not found',
  StudentAlreadyAssignedToBatch = 'Student already assigned to a batch',

  NoStudentsFound = 'No students found',

  // ======================
  // Success Messages
  // ======================

  StudentCreated = 'Student created successfully',
  StudentUpdated = 'Student updated successfully',
  StudentDeleted = 'Student deleted successfully',

  StudentFetched = 'Student fetched successfully',
  StudentsListed = 'Students fetched successfully',

  StudentAssignedToBatch = 'Student assigned to batch successfully',
  StudentRemovedFromBatch = 'Student removed from batch successfully',

  StudentStatusUpdated = 'Student status updated successfully',

    // ======================
    // Success Messages
    // ======================

  StudentFeeCreated = 'Student fee created successfully',
  StudentFeeFetched = 'Student fee Fetched successfully',
  StudentFeeNotFound = 'Student fee fot found',
  StudentFeeUpdated = 'Student fee updated successfully',
  StudentFeeDeleted = 'Student fee deleted successfully',
}

export enum TeacherMessage {
  // ======================
  // Error Messages
  // ======================

  TeacherExists = 'Teacher already exists with provided credentials',
  TeacherNotFound = 'Teacher not found',
  InvalidTeacherId = 'Invalid teacher ID',
  InvalidTeacherEmail = 'Invalid teacher Email',

  TeacherCreateFailed = 'Failed to create teacher',
  TeacherUpdateFailed = 'Failed to update teacher',
  TeacherDeleteFailed = 'Failed to delete teacher',

  ClassTeacherAlreadyAssigned = 'Another teacher is already assigned as class teacher for this batch',

  TeacherAlreadyAssignedToBatch = 'Teacher is already assigned to another batch',

  SubjectAssignmentFailed = 'Failed to assign subjects to teacher',
  SubjectRemovalFailed = 'Failed to remove subject from teacher',

  NoTeachersFound = 'No teachers found',
  NoUnassignedTeachersFound = 'No unassigned teachers found',

  // ======================
  // Success Messages
  // ======================

  TeacherBioCreated = 'Teacher bio created successfully',
  TeacherCreated = 'Teacher created successfully',
  TeacherUpdated = 'Teacher updated successfully',
  TeacherDeleted = 'Teacher deleted successfully',

  TeacherFetched = 'Teacher fetched successfully',
  TeacherVerify = 'Teacher verify successfully',
  TeachersListed = 'Teachers fetched successfully',

  ClassAssigned = 'Class assigned to teacher successfully',

  SubjectsAssigned = 'Subjects assigned successfully',
  SubjectRemoved = 'Subject removed successfully',

  UnassignedTeachersFetched = 'Unassigned teachers fetched successfully',
}

export enum CenterMessage {
  // Error messages
  CenterExists = 'Center already exists',
  CenterNotFound = 'Center not found',

  // Success messages
  CenterAdded = 'New center created',
  CenterUpdated = 'Center updated',
  CenterListed = 'Center has been listed',
  CenterUnlisted = 'Center has been unlisted',
  CenterDeleted = 'Center deleted successfully',
}

export enum SubscriptionPlanMessage {
  // ======================
  // Error Messages
  // ======================

  PlanExists = 'Plan already exists with provided details',
  PlanNotFound = 'Plan not found',
  InvalidPlanId = 'Invalid plan ID',

  PlanCreateFailed = 'Failed to create plan',
  PlanUpdateFailed = 'Failed to update plan',
  PlanDeleteFailed = 'Failed to delete plan',

  InvalidActiveStatus = 'Invalid active status value',
  InvalidPopularStatus = 'Invalid popular status value',

  InvalidPlanData = 'Invalid plan data provided',
  EmptyBody = 'Request body cannot be empty',

  NoPlansFound = 'No plans found',

  // ======================
  // Success Messages
  // ======================

  PlanCreated = 'Plan created successfully',
  PlanUpdated = 'Plan updated successfully',
  PlanDeleted = 'Plan deleted successfully',

  PlanFetched = 'Plan fetched successfully',
  PlansListed = 'Plans fetched successfully',

  PlanActivated = 'Plan activated successfully',
  PlanDeactivated = 'Plan deactivated successfully',

  PlanMarkedPopular = 'Plan marked as popular successfully',
  PlanUnmarkedPopular = 'Plan removed from popular successfully',
  //Success messages
  SubscriptionPlanAdded = 'Subscription plan added',
  SubscriptionPlanUpdated = 'Subscription plan updated',
  SubscriptionListed = 'Subscription plan listed',
  SubscriptionUnlisted = 'Subscription plan unlisted',
}

export enum SubjectMessage {
  // Error messages
  SubjectExists = 'Subject already exists',
  SubjectNotFound = 'Subject not found',

  // Success messages
  SubjectAdded = 'New subject created',
  SubjectUpdated = 'Subject updated',
  SubjectListed = 'Subject has been listed',
  SubjectUnlisted = 'Subject has been unlisted',
}

export enum NotificationMessage {
  // Error messages
  NotificationNotFound = 'Notification not found',
  NotificationNotFetched = 'Notification not fetched',
  NotificationCantRead = "Notification Couldn't read",
  
  // Success messages
  NotificationFetched = 'Notification fetched successfully',
  NotificationCreated = 'Notification created successfully',
  NotificationUpdated = 'Notification updated successfully',
  NotificationDeleted = 'Notification deleted successfully',
  NotificationIsRead = "Notification read successfully",
  NotificationSent = 'Notification sent successfully',
}

/**
 *SERVER-MESSAGE
 */
export enum ServerMessage {
  // Error messages
  ServerError = 'Internal server error',
  ServerNotRunning = 'Server is not running',
  PortInUse = 'Port is already in use',
  DatabaseConnectionFailed = 'Database connection failed',
  DatabaseDisconnected = 'Database disconnected',
  UnauthorizedAccess = 'Unauthorized access',
  ForbiddenAccess = 'Access forbidden',
  ResourceNotFound = 'Requested resource not found',
  InvalidRequest = 'Invalid request data',

  // Success messages
  ServerStarted = 'Server started successfully',
  ServerStopped = 'Server stopped successfully',
  DatabaseConnected = 'Database connected successfully',
  HealthCheckSuccess = 'Server health check successful',
}

// ATTENDANCE
export const AttendanceMessage = {
  AttendanceMarked: 'Attendance marked successfully',
  AttendanceFetched: 'Attendance fetched successfully',
  AttendanceListed: 'Attendance list fetched',
  AttendanceUpdated: 'Attendance updated successfully',
  AttendanceDeleted: 'Attendance deleted successfully',
  AttendanceNotFound: 'Attendance not found',
  AttendanceNotUpdated: 'Attendance not updated',
  AttendanceAlreadyMarked: 'Attendance already marked for this date',
};

export const LeaveMessage = {
  LeaveApplied: 'Leave applied successfully',
  LeaveFetched: 'Leave fetched successfully',
  LeaveListed: 'Leave list fetched',
  LeaveUpdated: 'Leave updated successfully',
  LeaveDeleted: 'Leave deleted successfully',

  LeaveNotFound: 'Leave not found',
  LeaveCredentialsNotFound: 'Leave credential are invalid',
  LeaveNotUpdated: 'Leave not updated',

  LeaveAlreadyApplied: 'Leave already applied for this date',

  LeaveApproved: 'Leave approved successfully',
  LeaveRejected: 'Leave rejected successfully',
};


//*CHAT MESSAGES
export enum ChatMessage {
  //  Error Messages
  ChatRoomNotFound = "Chat room not found",
  MessageNotFound = "Message not found",
  CannotSendMessage = "Unable to send message",
  CannotFetchMessages = "Unable to fetch messages",
  InvalidChatType = "Invalid chat type",
  UserNotInChat = "User is not part of this chat",
  UnauthorizedToSend = "You are not allowed to send messages in this chat",
  EmptyMessage = "Message cannot be empty",
  InvalidChatRoom = "Invalid chat room",
  ChatAlreadyExists = "Chat already exists",
  FailedToJoinRoom = "Failed to join chat room",

  //  Success Messages
  MessageSent = "Message sent successfully",
  MessagesFetched = "Messages fetched successfully",
  ChatCreated = "Chat room created successfully",
  ChatFetched = "Chat room fetched successfully",
  JoinedRoom = "Joined chat room successfully",
  LeftRoom = "Left chat room successfully",
  MessageDeleted = "Message deleted successfully",
  MessageUpdated = "Message updated successfully",

  // ROLE BASED MESSAGES
  BroadcastOnlyAdmin = "Only admin or teacher can send broadcast messages",
  DirectChatCreated = "Direct chat created",
  BatchChatFetched = "Batch chat fetched",
  BatchRoomCantCreate = "Batch room cant create, invalid credentials",
  CenterChatFetched = "Center chat fetched"
}