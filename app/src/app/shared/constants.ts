export class Constants {
  // Default routes
  public static DEFAULT_ADMIN_ROUTE: string = '/admin/users';
  public static DEFAULT_STUDENT_ROUTE: string = '/exams';
  public static DEFAULT_REVIEWER_ROUTE: string = '/';

  // Roles
  public static ROLE_ADMIN: string = 'Admin';
  public static ROLE_STUDENT: string = 'Student';
  public static ROLE_REVIEWER: string = 'Reviewer';

  // Permissions
  public static CAN_UPLOAD: string = 'can_upload';
  public static CAN_REQUEST: string = 'can_request';

  // Semester
  public static SEMESTERS = [
    { name: 'Fall', value: 1 },
    { name: 'Spring', value: 2 },
    { name: 'Summer', value: 3 }
  ];

  // Exam durations
  public static EXAM_DURATIONS = [
    { name: '< 1hour', value: 1 },
    { name: '< 2hours', value: 2 },
    { name: '< 3hours', value: 3 },
    { name: '< 4hours', value: 4 },
    { name: 'Any', value: 5 }
  ];

  // Exam numbers
  public static EXAM_NUMBERS = ['1' , '2', 'Midterm', '3', '4', 'Final'];

  // Exam delay in day
  public static EXAM_DELAYS = [
    { name: '3 days', value: 3 },
    { name: '5 days', value: 5 },
    { name: '10 days', value: 10 },
    { name: '12 days', value: 12 }
  ];

  // Exam Plan
  public static EXAM_PLANS = [
    { name: 'Mixed', value: 'mixed' },
    { name: 'Standard', value: 'standard' },
    { name: 'Premium', value: 'premium' }
  ];

  // Cache keys
  public static CACHE_KEYS = {
    ALL_STUDENTS: 'ALL_STUDENTS',
    ALL_REQUESTS: 'ALL_REQUESTS',
    ALL_EXAMS: 'ALL_EXAMS',
    ALL_GROUPS: 'ALL_GROUPS',
    ALL_PAYOUTS: 'ALL_PAYOUTS',
    ALL_PAYMENT_METHODS: 'ALL_PAYMENT_METHODS',
    ALL_REVIEWERS: 'ALL_REVIEWERS',
    ADMIN_SETTINGS: 'ADMIN_SETTINGS',
    ADMIN_EVENTS: 'ADMIN_EVENTS',
    ADMIN_MODIFIABLE_EVENTS: 'ADMIN_MODIFIABLE_EVENTS',
    ADMIN_WATERMARKS: 'ADMIN_WATERMARKS',
    USER_REQUESTS: 'USER_REQUESTS',
    USER_EXAMS: 'USER_EXAMS',
    USER_GROUPS: 'USER_GROUPS',
    USER_PAYMENT_METHODS: 'USER_PAYMENT_METHODS',
    REVIEWER_REVIEWABLE_EXAMS: 'REVIEWER_REVIEWABLE_EXAMS'
  };

  // Statuses
  public static EXAM_STATUS = {
    PENDING_ADMIN_REVIEW: 'pending-admin-review',
    ACTIVE: 'active',
    ADMIN_REJECTED: 'admin-rejected',
    SYSTEM_DISMISSED: 'system-dismissed'
  };
  public static GROUP_STATUS = {
    INIT: 'initialized',
    IN_PROGRESS: 'in-progress',
    PENDING_ADMIN_REVIEW: 'pending-admin-review',
    ACTIVE: 'active',
    SYSTEM_DISMISSED: 'system-dismissed'
  };
  public static EXAM_REVIEW_STATUS = {
    PENDING_SME_REVIEW: 'sme-pending',
    SME_UNCHANGED: 'sme-unchanged',
    SME_MODIFIED: 'sme-modified',
    SME_REJECTED: 'sme-rejected'
  };
  public static WATERMARK_STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
  };

  // Requirements
  public static REQUIRED_FILE_UPLOADS = {
    SINGLE_MODE: {
      QA_MODE_TRUE: {
        ungraded_exam_actual: 'u_act',
        graded_exam_actual: 'g_act',
      },
      QA_MODE_FALSE: {
        ungraded_exam_actual: 'u_act',
        graded_exam_actual: 'g_act',
        ungraded_mock_exam: 'u_mock',
        graded_mock_exam: 'g_mock'
      }
    },
    GROUP_MODE: {
      EXAM: {
        ungraded_mock_exam: 'u_mock',
        graded_mock_exam: 'g_mock',
      },
      STUDENT: {
        proof_of_exam_date: 'date_proven',
        proof_of_student_identity: 'identity_proven',
        combined_graded_and_ungraded_actual: 'exam_proven'
      }
    }
  }
}
