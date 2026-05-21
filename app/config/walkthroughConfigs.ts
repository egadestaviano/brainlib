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
}

export interface RouteWalkthroughConfig {
  route: string
  steps: WalkthroughStep[]
}

const walkthroughConfigs: RouteWalkthroughConfig[] = [
  {
    route: '/dashboard',
    steps: [
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
    route: '/classes',
    steps: [
      {
        target: 'sidebar-classes',
        title: 'Classes Navigation',
        description: 'Use the sidebar to quickly navigate to your classes. The class list expands to show all your enrolled classes.',
        placement: 'right',
      },
      {
        target: 'class-list',
        title: 'Class List',
        description: 'Browse all your classes here. You can create a new class or join one using a class code.',
        placement: 'bottom',
      },
      {
        target: 'class-card',
        title: 'Class Card',
        description: 'Each card displays the class name, description, instructor, and stats. Click to open the class.',
        placement: 'bottom',
      },
      {
        target: 'class-search',
        title: 'Class Actions',
        description: 'Use the action buttons to create a new class or join an existing one with a code from your teacher.',
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
        description: 'Update your display name and bio here. Changes are saved to your account and visible to others.',
        placement: 'top',
      },
      {
        target: 'profile-settings',
        title: 'Account Details',
        description: 'View your account information including email, status, and membership date.',
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
        description: 'Switch between the Lessons tab to view content and the Students tab to see who is enrolled in this class.',
        placement: 'top',
      },
    ],
  },
  {
    route: '/classes/:id/lessons/:lessonId',
    steps: [
      {
        target: 'lesson-breadcrumb',
        title: 'Breadcrumb Navigation',
        description: 'Use the breadcrumb to quickly navigate back to your class or the classes list without losing your place.',
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
        description: 'This is where lesson content appears — text, images, videos, or questions. Read carefully and interact as needed.',
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
        description: 'When you reach the last page, click Submit All to send your answers for grading. Make sure you have answered all questions!',
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
