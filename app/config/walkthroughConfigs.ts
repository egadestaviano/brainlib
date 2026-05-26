/**
 * Walkthrough step configuration for the guided tutorial system.
 * Each route has a set of steps that target elements via data-walkthrough attributes.
 */

export interface WalkthroughStep {
  /** data-walkthrough attribute value to target */
  target: string
  /** Tooltip title */
  title: string
  /** Tooltip description (max 200 chars) */
  description: string
  /** Preferred tooltip placement */
  placement: 'top' | 'bottom' | 'left' | 'right'
  /** If true, user must click the highlighted element to proceed (no Next button shown) */
  requireClick?: boolean
}

export interface RouteWalkthroughConfig {
  route: string
  steps: WalkthroughStep[]
}

const walkthroughConfigs: RouteWalkthroughConfig[] = [
  {
    route: '/',
    steps: [
      {
        target: 'landing-login-btn',
        title: 'Login to BrainLib',
        description: 'Click the Login button to sign in to your account or create a new one. This is your first step!',
        placement: 'bottom',
        requireClick: true,
      },
    ],
  },
  {
    route: '/auth/login',
    steps: [
      {
        target: 'login-title',
        title: 'Sign In Page',
        description: 'Welcome to BrainLib! Enter your email and password here to access your account.',
        placement: 'bottom',
      },
      {
        target: 'login-email',
        title: 'Email Field',
        description: 'Enter the email address you used when registering your account.',
        placement: 'bottom',
      },
      {
        target: 'login-password',
        title: 'Password Field',
        description: 'Enter your password. Use "Forgot password?" if you need to reset it.',
        placement: 'bottom',
      },
      {
        target: 'login-remember',
        title: 'Remember Me',
        description: 'Check this to stay logged in. Useful if you use BrainLib frequently on this device.',
        placement: 'bottom',
      },
      {
        target: 'login-submit',
        title: 'Sign In Button',
        description: 'Click here to log in with your credentials. You\'ll be redirected to your classes.',
        placement: 'top',
      },
      {
        target: 'login-demo',
        title: 'Demo Accounts',
        description: 'Try BrainLib instantly! Click Demo Teacher or Demo Student to explore without registering.',
        placement: 'top',
      },
    ],
  },
  {
    route: '/auth/register',
    steps: [
      {
        target: 'register-title',
        title: 'Create Account',
        description: 'Fill in your details to create a new BrainLib account and start learning or teaching.',
        placement: 'bottom',
      },
      {
        target: 'register-name',
        title: 'Full Name',
        description: 'Enter your display name. This is how other users will see you on the platform.',
        placement: 'bottom',
      },
      {
        target: 'register-email',
        title: 'Email Address',
        description: 'Use a valid email address. You\'ll use this to log in to your account.',
        placement: 'bottom',
      },
      {
        target: 'register-password',
        title: 'Password',
        description: 'Create a secure password. You\'ll need to confirm it in the next field.',
        placement: 'bottom',
      },
      {
        target: 'register-role',
        title: 'Choose Your Role',
        description: 'Select Student to join classes, or Teacher to create and manage your own classes.',
        placement: 'top',
      },
      {
        target: 'register-terms',
        title: 'Terms of Service',
        description: 'You must agree to the Terms of Service before creating your account.',
        placement: 'top',
      },
      {
        target: 'register-submit',
        title: 'Create Account',
        description: 'Click here to register. After success, you\'ll be redirected to the login page.',
        placement: 'top',
      },
    ],
  },
  {
    route: '/dashboard',
    steps: [
      {
        target: 'header-menu',
        title: 'Menu Toggle',
        description: 'Click this button to collapse or expand the sidebar. Useful for getting more screen space.',
        placement: 'bottom',
      },
      {
        target: 'header-user',
        title: 'Your Account',
        description: 'Click your avatar to access your profile or log out. Your initials are shown here.',
        placement: 'bottom',
      },
      {
        target: 'sidebar-classes',
        title: 'Classes Navigation',
        description: 'Quick access to your classes. Click the chevron to expand and see all your enrolled classes.',
        placement: 'right',
      },
      {
        target: 'sidebar-class-list',
        title: 'Class List',
        description: 'All your enrolled classes appear here. Click any class to jump directly to it.',
        placement: 'right',
      },
      {
        target: 'sidebar-class-card',
        title: 'Class Card',
        description: 'Each card shows the class name and teacher. Click any card to navigate directly to that class.',
        placement: 'right',
      },
      {
        target: 'dashboard-welcome',
        title: 'Welcome to Dashboard',
        description: 'This is your dashboard where you can see an overview of your classes and activity at a glance.',
        placement: 'bottom',
      },
      {
        target: 'dashboard-grid',
        title: 'Your Classes',
        description: 'All your enrolled classes are displayed here in a grid. Click any card to open the class.',
        placement: 'top',
      },
      {
        target: 'class-card',
        title: 'Class Card',
        description: 'Each card shows the class title, instructor, student count, and lesson count. Click to enter.',
        placement: 'bottom',
      },
      {
        target: 'dashboard-stats',
        title: 'Class Details',
        description: 'View the number of students and lessons in each class from the card footer.',
        placement: 'top',
      },
    ],
  },
  {
    route: '/home',
    steps: [
      {
        target: 'header-menu',
        title: 'Menu Toggle',
        description: 'Click this button to collapse or expand the sidebar for more workspace.',
        placement: 'bottom',
      },
      {
        target: 'home-header',
        title: 'My Classes',
        description: 'This page shows all your enrolled classes. You can browse and open any class from here.',
        placement: 'bottom',
      },
      {
        target: 'home-grid',
        title: 'Class Grid',
        description: 'Your classes are displayed as cards. Each shows the title, description, teacher, and student count.',
        placement: 'top',
      },
      {
        target: 'home-class-card',
        title: 'Class Card',
        description: 'Click any card to open the class and view its lessons and materials.',
        placement: 'bottom',
      },
    ],
  },
  {
    route: '/classes',
    steps: [
      {
        target: 'sidebar-classes',
        title: 'Classes Navigation',
        description: 'Use the sidebar to quickly navigate to your classes. The class list expands to show all your enrolled classes.',
        placement: 'right',
      },
      {
        target: 'sidebar-class-card',
        title: 'Class Card in Sidebar',
        description: 'Each card shows the class name and teacher. Click any card to navigate directly to that class.',
        placement: 'right',
      },
      {
        target: 'class-search',
        title: 'Page Header & Actions',
        description: 'See your total class count and use the buttons to create a new class or join one with a code.',
        placement: 'bottom',
      },
      {
        target: 'class-create-btn',
        title: 'Create or Join',
        description: 'Teachers can create new classes. Students can join using a class code shared by their teacher.',
        placement: 'bottom',
      },
      {
        target: 'class-list',
        title: 'Class Grid',
        description: 'Browse all your classes here. Each card shows the banner, title, teacher, and stats.',
        placement: 'top',
      },
      {
        target: 'class-card',
        title: 'Class Card',
        description: 'Each card displays the class name, description, instructor, and student/lesson counts. Click to open.',
        placement: 'bottom',
      },
    ],
  },
  {
    route: '/profile',
    steps: [
      {
        target: 'profile-avatar',
        title: 'Your Profile',
        description: 'This is your profile card showing your display name, email, roles, and account status.',
        placement: 'bottom',
      },
      {
        target: 'profile-info',
        title: 'Edit Profile',
        description: 'Update your display name and bio here. Click Save Changes when done.',
        placement: 'top',
      },
      {
        target: 'profile-save-btn',
        title: 'Save Changes',
        description: 'After editing your name or bio, click this button to save. It only activates when you make changes.',
        placement: 'top',
      },
      {
        target: 'profile-settings',
        title: 'Account Details',
        description: 'View your account information including email, status, member since date, and user ID.',
        placement: 'left',
      },
    ],
  },
  {
    route: '/subscription',
    steps: [
      {
        target: 'subscription-header',
        title: 'Subscription Plans',
        description: 'Choose a plan that fits your needs. Plans determine how many classes, students, and lessons you can have.',
        placement: 'bottom',
      },
      {
        target: 'subscription-billing-toggle',
        title: 'Billing Cycle',
        description: 'Switch between monthly and yearly billing. Yearly plans save you 10% compared to monthly.',
        placement: 'bottom',
      },
      {
        target: 'subscription-plans-grid',
        title: 'Plan Cards',
        description: 'Compare features across Starter, Medium, and Enterprise plans. Your current plan is highlighted.',
        placement: 'top',
      },
      {
        target: 'subscription-plan-starter',
        title: 'Starter Plan',
        description: 'Free plan for individual educators. Includes 1 class, 10 students, and 5 lessons per class.',
        placement: 'right',
      },
      {
        target: 'subscription-plan-medium',
        title: 'Medium Plan',
        description: 'For growing teams. Up to 10 classes, 50 students, and 20 lessons per class.',
        placement: 'bottom',
      },
      {
        target: 'subscription-plan-enterprise',
        title: 'Enterprise Plan',
        description: 'Unlimited everything for large organizations. No limits on classes, students, or lessons.',
        placement: 'left',
      },
    ],
  },
  {
    route: '/classes/:id',
    steps: [
      {
        target: 'class-detail-breadcrumb',
        title: 'Navigation',
        description: 'Use the breadcrumb to go back to your classes list. You can always return here from the sidebar too.',
        placement: 'bottom',
      },
      {
        target: 'class-detail-hero',
        title: 'Class Overview',
        description: 'This is your class header showing the title, description, and a color-coded banner for quick identification.',
        placement: 'bottom',
      },
      {
        target: 'class-detail-code',
        title: 'Class Code',
        description: 'Share this code with students so they can join your class. Click to copy it to your clipboard.',
        placement: 'left',
      },
      {
        target: 'class-detail-meta',
        title: 'Class Info',
        description: 'See the teacher name, number of students, total lessons, and when the class was created at a glance.',
        placement: 'top',
      },
      {
        target: 'class-detail-tabs',
        title: 'Lessons & Students',
        description: 'Switch between the Lessons tab to view content and the Students tab to see who is enrolled.',
        placement: 'top',
      },
      {
        target: 'class-detail-add-lesson',
        title: 'Add Lesson',
        description: 'Teachers can add new lessons here. Click to create content blocks like text, images, videos, and quizzes.',
        placement: 'bottom',
      },
      {
        target: 'class-detail-lesson-item',
        title: 'Lesson Item',
        description: 'Each lesson is listed here with its title and summary. Click to open and start learning.',
        placement: 'bottom',
      },
    ],
  },
  {
    route: '/classes/:id/lessons/:lessonId',
    steps: [
      {
        target: 'lesson-breadcrumb',
        title: 'Breadcrumb Navigation',
        description: 'Use the breadcrumb to quickly navigate back to your class or the classes list.',
        placement: 'bottom',
      },
      {
        target: 'lesson-hero',
        title: 'Lesson Overview',
        description: 'This card shows the lesson title, summary, and content type. It gives you a quick overview before diving in.',
        placement: 'bottom',
      },
      {
        target: 'lesson-progress',
        title: 'Progress Tracker',
        description: 'Track your progress through the lesson. The bar fills as you move through each content block or question.',
        placement: 'bottom',
      },
      {
        target: 'lesson-step-indicators',
        title: 'Step Indicators',
        description: 'Click any step dot to jump directly to that section. Completed steps are highlighted in blue.',
        placement: 'bottom',
      },
      {
        target: 'lesson-content',
        title: 'Content Area',
        description: 'Lesson content appears here — text, images, videos, or questions. Read carefully and interact as needed.',
        placement: 'top',
      },
      {
        target: 'lesson-nav-prev',
        title: 'Previous Button',
        description: 'Go back to the previous content block or question if you need to review something.',
        placement: 'top',
      },
      {
        target: 'lesson-nav-next',
        title: 'Next Button',
        description: 'Move forward to the next content block. On the last page, this becomes the Submit button.',
        placement: 'top',
      },
      {
        target: 'lesson-submit',
        title: 'Submit All',
        description: 'When you reach the last page, click Submit All to send your answers for grading.',
        placement: 'top',
      },
    ],
  },
]

/**
 * Converts a route pattern (e.g. '/classes/:id/lessons/:lessonId') to a regex.
 */
function routeToRegex(pattern: string): RegExp {
  // Split by :param segments, escape static parts, rejoin with [^/]+
  const parts = pattern.split(/:(\w+)/)
  let regexStr = ''
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i] ?? ''
    if (i % 2 === 0) {
      // Static segment — escape special regex chars
      regexStr += part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    } else {
      // Dynamic param — match any non-slash characters
      regexStr += '[^/]+'
    }
  }
  return new RegExp(`^${regexStr}$`)
}

/**
 * Returns the walkthrough configuration for a given route, or null if no config exists.
 * Supports both exact routes (e.g. '/dashboard') and dynamic patterns (e.g. '/classes/:id/lessons/:lessonId').
 */
export function getWalkthroughConfig(route: string): RouteWalkthroughConfig | null {
  // Try exact match first
  const exact = walkthroughConfigs.find((config) => config.route === route)
  if (exact) return exact

  // Try pattern match for dynamic routes
  return walkthroughConfigs.find((config) => {
    if (!config.route.includes(':')) return false
    return routeToRegex(config.route).test(route)
  }) ?? null
}

export default walkthroughConfigs
