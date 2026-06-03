<template>
  <div class="max-w-4xl mx-auto space-y-12 py-12 px-4">
    <!-- Page Header -->
    <div class="text-center space-y-4">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wider ring-1 ring-blue-100">
        <UIcon name="heroicons-book-open" class="h-3.5 w-3.5" />
        User Guide
      </div>
      <h1 class="text-4xl font-bold tracking-tight text-slate-900">Getting Started with BrainLib</h1>
      <p class="text-lg text-slate-600 max-w-2xl mx-auto">
        A comprehensive guide to help you navigate the platform, manage classes, take lessons, and make the most of your learning experience.
      </p>
    </div>

    <!-- Section: Login -->
    <section id="login" class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="p-8 space-y-5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center ring-1 ring-cyan-100">
            <UIcon name="heroicons-arrow-right-on-rectangle" class="h-5 w-5 text-cyan-600" />
          </div>
          <h2 class="text-2xl font-semibold text-slate-900">Login</h2>
        </div>
        <p class="text-slate-600 leading-relaxed">
          The login page is your entry point to BrainLib. Enter your <strong>email</strong> and <strong>password</strong>
          to access your account. You can also use the <strong>Demo Teacher</strong> or <strong>Demo Student</strong>
          buttons to quickly explore the platform without creating an account.
        </p>
        <div class="rounded-xl border border-slate-100 overflow-hidden bg-slate-50 p-4">
          <img
            src="/image/guide/auth-login.svg"
            alt="Login page showing the BrainLib branding panel on the left and the sign-in form with email, password fields, and demo account buttons on the right"
            class="w-full h-48 object-contain"
          />
        </div>
        <ul class="space-y-2 text-sm text-slate-600">
          <li class="flex items-start gap-2">
            <UIcon name="heroicons-check-circle" class="h-5 w-5 text-cyan-500 shrink-0 mt-0.5" />
            <span><strong>Email &amp; Password</strong> — Enter your registered credentials to sign in</span>
          </li>
          <li class="flex items-start gap-2">
            <UIcon name="heroicons-check-circle" class="h-5 w-5 text-cyan-500 shrink-0 mt-0.5" />
            <span><strong>Remember me</strong> — Keep your session active so you don't have to log in every time</span>
          </li>
          <li class="flex items-start gap-2">
            <UIcon name="heroicons-check-circle" class="h-5 w-5 text-cyan-500 shrink-0 mt-0.5" />
            <span><strong>Forgot password?</strong> — Click to reset your password via email</span>
          </li>
          <li class="flex items-start gap-2">
            <UIcon name="heroicons-check-circle" class="h-5 w-5 text-cyan-500 shrink-0 mt-0.5" />
            <span><strong>Demo accounts</strong> — Instantly log in as a demo teacher or student to explore features</span>
          </li>
          <li class="flex items-start gap-2">
            <UIcon name="heroicons-check-circle" class="h-5 w-5 text-cyan-500 shrink-0 mt-0.5" />
            <span><strong>Sign up link</strong> — Don't have an account? Click to go to the registration page</span>
          </li>
        </ul>
      </div>
    </section>

    <!-- Section: Register -->
    <section id="register" class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="p-8 space-y-5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-lime-50 flex items-center justify-center ring-1 ring-lime-100">
            <UIcon name="heroicons-user-plus" class="h-5 w-5 text-lime-600" />
          </div>
          <h2 class="text-2xl font-semibold text-slate-900">Register</h2>
        </div>
        <p class="text-slate-600 leading-relaxed">
          Create a new BrainLib account by filling in your details. Choose whether you want to register as a
          <strong>Student</strong> (to join and take classes) or a <strong>Teacher</strong> (to create and manage classes).
          You must agree to the Terms of Service before creating your account.
        </p>
        <div class="rounded-xl border border-slate-100 overflow-hidden bg-slate-50 p-4">
          <img
            src="/image/guide/auth-register.svg"
            alt="Registration page showing the BrainLib branding panel on the left and the sign-up form with name, email, password, confirm password, and role selector on the right"
            class="w-full h-48 object-contain"
          />
        </div>
        <ul class="space-y-2 text-sm text-slate-600">
          <li class="flex items-start gap-2">
            <UIcon name="heroicons-check-circle" class="h-5 w-5 text-lime-500 shrink-0 mt-0.5" />
            <span><strong>Full Name</strong> — Your display name visible to other users on the platform</span>
          </li>
          <li class="flex items-start gap-2">
            <UIcon name="heroicons-check-circle" class="h-5 w-5 text-lime-500 shrink-0 mt-0.5" />
            <span><strong>Email</strong> — Used for login and notifications. Must be unique</span>
          </li>
          <li class="flex items-start gap-2">
            <UIcon name="heroicons-check-circle" class="h-5 w-5 text-lime-500 shrink-0 mt-0.5" />
            <span><strong>Password &amp; Confirm</strong> — Create a secure password and confirm it. Both must match</span>
          </li>
          <li class="flex items-start gap-2">
            <UIcon name="heroicons-check-circle" class="h-5 w-5 text-lime-500 shrink-0 mt-0.5" />
            <span><strong>Register As</strong> — Choose "Student" to join classes or "Teacher" to create and manage them</span>
          </li>
          <li class="flex items-start gap-2">
            <UIcon name="heroicons-check-circle" class="h-5 w-5 text-lime-500 shrink-0 mt-0.5" />
            <span><strong>Terms of Service</strong> — You must agree before your account can be created</span>
          </li>
          <li class="flex items-start gap-2">
            <UIcon name="heroicons-check-circle" class="h-5 w-5 text-lime-500 shrink-0 mt-0.5" />
            <span><strong>Demo accounts</strong> — Quickly register with pre-filled demo credentials for testing</span>
          </li>
        </ul>
      </div>
    </section>

    <!-- Section 2: Navigation & Layout -->
    <section id="navigation" class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="p-8 space-y-5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center ring-1 ring-violet-100">
            <UIcon name="heroicons-bars-3" class="h-5 w-5 text-violet-600" />
          </div>
          <h2 class="text-2xl font-semibold text-slate-900">Navigation & Layout</h2>
        </div>
        <p class="text-slate-600 leading-relaxed">
          The platform has three main areas: the <strong>sidebar</strong> on the left for navigation,
          the <strong>header</strong> at the top for account access, and the <strong>main content area</strong>
          where pages are displayed. The sidebar is collapsed or expanded manually from the hamburger menu.
        </p>
        <div class="rounded-xl border border-slate-100 overflow-hidden bg-slate-50 p-4">
          <img
            src="/image/guide/header-account.svg"
            alt="Header bar showing the hamburger menu button on the left and user avatar on the right with an open account popover"
            class="w-full h-40 object-contain"
          />
        </div>
        <div class="rounded-xl border border-slate-100 overflow-hidden bg-slate-50 p-4">
          <img
            src="/image/guide/navigation-sidebar.svg"
            alt="Sidebar navigation showing the classes link expanded to reveal a list of enrolled classes"
            class="w-full h-48 object-contain"
          />
        </div>
        <ul class="space-y-2 text-sm text-slate-600">
          <li class="flex items-start gap-2">
            <UIcon name="heroicons-check-circle" class="h-5 w-5 text-violet-500 shrink-0 mt-0.5" />
            <span><strong>Hamburger menu</strong> — Click to collapse/expand the sidebar manually</span>
          </li>
          <li class="flex items-start gap-2">
            <UIcon name="heroicons-check-circle" class="h-5 w-5 text-violet-500 shrink-0 mt-0.5" />
            <span><strong>Sidebar class list</strong> — Saat sidebar collapse, kelas tetap tampil ringkas; saat expand, click chevron untuk show/hide classes</span>
          </li>
          <li class="flex items-start gap-2">
            <UIcon name="heroicons-check-circle" class="h-5 w-5 text-violet-500 shrink-0 mt-0.5" />
            <span><strong>User avatar</strong> — Click to access Profile or Logout</span>
          </li>
          <li class="flex items-start gap-2">
            <UIcon name="heroicons-check-circle" class="h-5 w-5 text-violet-500 shrink-0 mt-0.5" />
            <span><strong>Footer links</strong> — Subscription (teachers) and System Analytics (admin) appear at the bottom</span>
          </li>
        </ul>
      </div>
    </section>

    <!-- Section 3: Managing Classes -->
    <section id="classes" class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="p-8 space-y-5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center ring-1 ring-blue-100">
            <UIcon name="heroicons-academic-cap" class="h-5 w-5 text-blue-600" />
          </div>
          <h2 class="text-2xl font-semibold text-slate-900">Managing Your Classes</h2>
        </div>
        <p class="text-slate-600 leading-relaxed">
          Classes are the core of BrainLib. As a <strong>teacher</strong>, you can create classes and share a unique code with your students.
          As a <strong>student</strong>, you can join classes using the code provided by your teacher. Each class contains lessons,
          materials, and activities organized by your instructor.
        </p>
        <div class="rounded-xl border border-slate-100 overflow-hidden bg-slate-50 p-4">
          <img
            src="/image/guide/classes-overview.svg"
            alt="Classes page showing a grid of class cards with colored banners, titles, teacher names, and student counts"
            class="w-full h-48 object-contain"
          />
        </div>

        <h3 class="text-lg font-semibold text-slate-800 pt-2">For Teachers</h3>
        <ul class="space-y-2 text-sm text-slate-600">
          <li class="flex items-start gap-2">
            <UIcon name="heroicons-check-circle" class="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
            <span>Click <strong>"Create Class"</strong> to set up a new class with title and description</span>
          </li>
          <li class="flex items-start gap-2">
            <UIcon name="heroicons-check-circle" class="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
            <span>Share the auto-generated <strong>class code</strong> with students (visible on the class card and detail page)</span>
          </li>
          <li class="flex items-start gap-2">
            <UIcon name="heroicons-check-circle" class="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
            <span>Add lessons with text, images, videos, multiple choice quizzes, and essay questions</span>
          </li>
          <li class="flex items-start gap-2">
            <UIcon name="heroicons-check-circle" class="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
            <span>View student submissions and scores from the lesson results page</span>
          </li>
        </ul>

        <h3 class="text-lg font-semibold text-slate-800 pt-2">For Students</h3>
        <ul class="space-y-2 text-sm text-slate-600">
          <li class="flex items-start gap-2">
            <UIcon name="heroicons-check-circle" class="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
            <span>Click <strong>"Join Class"</strong> and enter the code from your teacher</span>
          </li>
          <li class="flex items-start gap-2">
            <UIcon name="heroicons-check-circle" class="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
            <span>Browse your enrolled classes from the grid or sidebar</span>
          </li>
          <li class="flex items-start gap-2">
            <UIcon name="heroicons-check-circle" class="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
            <span>Click any class card to view its lessons and start learning</span>
          </li>
        </ul>
      </div>
    </section>

    <!-- Section: Create New Class Modal -->
    <section id="create-class" class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="p-8 space-y-5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center ring-1 ring-blue-100">
            <UIcon name="heroicons-plus-circle" class="h-5 w-5 text-blue-600" />
          </div>
          <h2 class="text-2xl font-semibold text-slate-900">Create New Class</h2>
        </div>
        <p class="text-slate-600 leading-relaxed">
          When you click <strong>"Create Class"</strong> on the classes page, a modal dialog appears where you can set up
          your new class. Fill in the class title and a brief description, then click <strong>Create Class</strong> to
          finalize. The class will be created with a unique code that students can use to join.
        </p>
        <div class="rounded-xl border border-slate-100 overflow-hidden bg-slate-50 p-4">
          <img
            src="/image/guide/create-class-modal.svg"
            alt="Create New Class modal showing a form with class title and description fields, plus Cancel and Create Class buttons"
            class="w-full h-48 object-contain"
          />
        </div>
        <ul class="space-y-2 text-sm text-slate-600">
          <li class="flex items-start gap-2">
            <UIcon name="heroicons-check-circle" class="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
            <span><strong>Class Title</strong> — Give your class a clear, descriptive name (e.g. "Mathematics 101")</span>
          </li>
          <li class="flex items-start gap-2">
            <UIcon name="heroicons-check-circle" class="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
            <span><strong>Description</strong> — A brief overview of what students will learn in this class</span>
          </li>
          <li class="flex items-start gap-2">
            <UIcon name="heroicons-check-circle" class="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
            <span><strong>Create Class button</strong> — Submits the form and creates the class with an auto-generated code</span>
          </li>
          <li class="flex items-start gap-2">
            <UIcon name="heroicons-check-circle" class="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
            <span><strong>Subscription limits</strong> — If you've reached your plan's class limit, an error will appear with a link to upgrade</span>
          </li>
        </ul>
        <div class="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <div class="flex items-start gap-3">
            <UIcon name="heroicons-information-circle" class="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
            <p class="text-sm text-blue-800">
              Only users with the <strong>Teacher</strong> role can create classes. Students will see a "Join Class" button instead.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Section: Create New Lesson Modal -->
    <section id="create-lesson" class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="p-8 space-y-5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center ring-1 ring-indigo-100">
            <UIcon name="heroicons-document-plus" class="h-5 w-5 text-indigo-600" />
          </div>
          <h2 class="text-2xl font-semibold text-slate-900">Create New Lesson</h2>
        </div>
        <p class="text-slate-600 leading-relaxed">
          Inside a class, teachers can add lessons by clicking <strong>"Add Lesson"</strong>. The lesson editor is a
          two-tab modal: first fill in the <strong>Details</strong> (title, description), then switch to the
          <strong>Content</strong> tab to add content blocks like text, images, videos, quizzes, and essays.
          You can also use <strong>AI generation</strong> to automatically create content blocks from a prompt.
        </p>
        <div class="rounded-xl border border-slate-100 overflow-hidden bg-slate-50 p-4">
          <img
            src="/image/guide/create-lesson-modal.svg"
            alt="Create New Lesson modal showing the Details tab with lesson title and description fields, and tabs for Details and Content"
            class="w-full h-52 object-contain"
          />
        </div>

        <h3 class="text-lg font-semibold text-slate-800 pt-2">Details Tab</h3>
        <ul class="space-y-2 text-sm text-slate-600">
          <li class="flex items-start gap-2">
            <UIcon name="heroicons-check-circle" class="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
            <span><strong>Lesson Title</strong> — A clear name for the lesson (e.g. "Introduction to Algebra")</span>
          </li>
          <li class="flex items-start gap-2">
            <UIcon name="heroicons-check-circle" class="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
            <span><strong>Description</strong> — Short overview shown to students before they start the lesson</span>
          </li>
          <li class="flex items-start gap-2">
            <UIcon name="heroicons-check-circle" class="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
            <span><strong>Short Content</strong> — Optional preview text for the lesson card</span>
          </li>
          <li class="flex items-start gap-2">
            <UIcon name="heroicons-check-circle" class="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
            <span><strong>Continue to Content</strong> — Validates details and moves to the content editor</span>
          </li>
        </ul>

        <h3 class="text-lg font-semibold text-slate-800 pt-2">Content Tab</h3>
        <ul class="space-y-2 text-sm text-slate-600">
          <li class="flex items-start gap-2">
            <UIcon name="heroicons-check-circle" class="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
            <span><strong>AI Generator</strong> — Describe what you want and AI creates content blocks automatically</span>
          </li>
          <li class="flex items-start gap-2">
            <UIcon name="heroicons-check-circle" class="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
            <span><strong>Add Block</strong> — Manually add content blocks: Text, Image, Video, Multiple Choice, or Essay</span>
          </li>
          <li class="flex items-start gap-2">
            <UIcon name="heroicons-check-circle" class="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
            <span><strong>Reorder blocks</strong> — Use the up/down arrows to arrange content in the desired order</span>
          </li>
          <li class="flex items-start gap-2">
            <UIcon name="heroicons-check-circle" class="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
            <span><strong>Save Lesson</strong> — Saves the lesson with all its content blocks to the class</span>
          </li>
        </ul>
        <div class="bg-violet-50 border border-violet-100 rounded-xl p-4">
          <div class="flex items-start gap-3">
            <UIcon name="heroicons-sparkles" class="h-5 w-5 text-violet-500 mt-0.5 shrink-0" />
            <p class="text-sm text-violet-800">
              <strong>Pro tip:</strong> Use the AI generator to quickly scaffold a lesson. Describe the topic and question types you want, and it will generate all the blocks for you. You can then edit them individually.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 4: Class Detail -->
    <section id="class-detail" class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="p-8 space-y-5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center ring-1 ring-indigo-100">
            <UIcon name="heroicons-rectangle-stack" class="h-5 w-5 text-indigo-600" />
          </div>
          <h2 class="text-2xl font-semibold text-slate-900">Inside a Class</h2>
        </div>
        <p class="text-slate-600 leading-relaxed">
          When you open a class, you'll see the class header with its title, description, teacher info, and stats.
          The <strong>class code</strong> is displayed in the banner — click it to copy and share with students.
          Below the header, tabs let you switch between <strong>Lessons</strong> and <strong>Students</strong>.
        </p>
        <div class="rounded-xl border border-slate-100 overflow-hidden bg-slate-50 p-4">
          <img
            src="/image/guide/class-detail.svg"
            alt="Class detail page showing the hero header with class code, meta information, and tabs for Lessons and Students"
            class="w-full h-56 object-contain"
          />
        </div>
        <ul class="space-y-2 text-sm text-slate-600">
          <li class="flex items-start gap-2">
            <UIcon name="heroicons-check-circle" class="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
            <span><strong>Class code</strong> — Click the code in the banner to copy it to clipboard</span>
          </li>
          <li class="flex items-start gap-2">
            <UIcon name="heroicons-check-circle" class="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
            <span><strong>Meta row</strong> — Shows teacher, student count, lesson count, and creation date</span>
          </li>
          <li class="flex items-start gap-2">
            <UIcon name="heroicons-check-circle" class="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
            <span><strong>Lessons tab</strong> — Lists all lessons; teachers can add new ones with "Add Lesson"</span>
          </li>
          <li class="flex items-start gap-2">
            <UIcon name="heroicons-check-circle" class="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
            <span><strong>Students tab</strong> — Shows all enrolled students and their roles</span>
          </li>
          <li class="flex items-start gap-2">
            <UIcon name="heroicons-check-circle" class="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
            <span><strong>Breadcrumb</strong> — Navigate back to the classes list at any time</span>
          </li>
        </ul>
      </div>
    </section>

    <!-- Section 5: Taking Lessons -->
    <section id="lessons" class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="p-8 space-y-5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center ring-1 ring-emerald-100">
            <UIcon name="heroicons-book-open" class="h-5 w-5 text-emerald-600" />
          </div>
          <h2 class="text-2xl font-semibold text-slate-900">Taking Lessons</h2>
        </div>
        <p class="text-slate-600 leading-relaxed">
          Lessons are made up of content blocks — text, images, videos, quizzes, and essays. You navigate through them
          one at a time using the <strong>Previous</strong> and <strong>Next</strong> buttons. A progress bar at the top
          shows how far you've gone, and step indicators let you jump to any section.
        </p>
        <div class="rounded-xl border border-slate-100 overflow-hidden bg-slate-50 p-4">
          <img
            src="/image/guide/lesson-view.svg"
            alt="Lesson view showing the progress bar with step indicators, a reading content block, and navigation buttons"
            class="w-full h-56 object-contain"
          />
        </div>
        <ul class="space-y-2 text-sm text-slate-600">
          <li class="flex items-start gap-2">
            <UIcon name="heroicons-check-circle" class="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
            <span><strong>Progress bar</strong> — Shows your current position and percentage completion</span>
          </li>
          <li class="flex items-start gap-2">
            <UIcon name="heroicons-check-circle" class="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
            <span><strong>Step indicators</strong> — Click any dot to jump directly to that block</span>
          </li>
          <li class="flex items-start gap-2">
            <UIcon name="heroicons-check-circle" class="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
            <span><strong>Content types</strong> — Reading (text), Image, Video, Quiz (multiple choice), Essay</span>
          </li>
          <li class="flex items-start gap-2">
            <UIcon name="heroicons-check-circle" class="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
            <span><strong>Navigation</strong> — Use Prev/Next buttons or click step dots to move around</span>
          </li>
          <li class="flex items-start gap-2">
            <UIcon name="heroicons-check-circle" class="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
            <span><strong>Reset</strong> — Clear all answers and start over (before submitting)</span>
          </li>
        </ul>
      </div>
    </section>

    <!-- Section 6: Answering Questions -->
    <section id="quizzes" class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="p-8 space-y-5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center ring-1 ring-purple-100">
            <UIcon name="heroicons-question-mark-circle" class="h-5 w-5 text-purple-600" />
          </div>
          <h2 class="text-2xl font-semibold text-slate-900">Answering Questions</h2>
        </div>
        <p class="text-slate-600 leading-relaxed">
          Lessons can contain <strong>multiple choice</strong> and <strong>essay</strong> questions. For multiple choice,
          click an option to select it — your choice is highlighted in blue. For essays, type your answer in the text area;
          it auto-saves as you type. After answering all questions, click <strong>Submit All</strong> on the last page.
        </p>
        <div class="rounded-xl border border-slate-100 overflow-hidden bg-slate-50 p-4">
          <img
            src="/image/guide/quiz-answer.svg"
            alt="Multiple choice question showing four options with option B selected and highlighted in blue"
            class="w-full h-52 object-contain"
          />
        </div>
        <ul class="space-y-2 text-sm text-slate-600">
          <li class="flex items-start gap-2">
            <UIcon name="heroicons-check-circle" class="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />
            <span><strong>Multiple choice</strong> — Click any option to select. You can change your answer before submitting</span>
          </li>
          <li class="flex items-start gap-2">
            <UIcon name="heroicons-check-circle" class="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />
            <span><strong>Essay</strong> — Type your answer; it auto-saves after you stop typing for ~1 second</span>
          </li>
          <li class="flex items-start gap-2">
            <UIcon name="heroicons-check-circle" class="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />
            <span><strong>Submit All</strong> — Appears on the last page; submits all your answers at once</span>
          </li>
          <li class="flex items-start gap-2">
            <UIcon name="heroicons-check-circle" class="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />
            <span><strong>Review mode</strong> — After submitting, correct answers show in blue, wrong in red with explanations</span>
          </li>
        </ul>
      </div>
    </section>

    <!-- Section 7: Results & Scores -->
    <section id="results" class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="p-8 space-y-5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center ring-1 ring-rose-100">
            <UIcon name="heroicons-trophy" class="h-5 w-5 text-rose-600" />
          </div>
          <h2 class="text-2xl font-semibold text-slate-900">Results & Scores</h2>
        </div>
        <p class="text-slate-600 leading-relaxed">
          After submitting, you'll see your results with the number of correct and wrong answers, plus your accuracy percentage.
          Click <strong>"Review Answers"</strong> to go back through the lesson and see which questions you got right or wrong,
          along with explanations where available.
        </p>
        <div class="rounded-xl border border-slate-100 overflow-hidden bg-slate-50 p-4">
          <img
            src="/image/guide/submit-results.svg"
            alt="Results page showing a trophy icon, score cards for correct, wrong, and accuracy percentage, with a Review Answers button"
            class="w-full h-48 object-contain"
          />
        </div>
        <ul class="space-y-2 text-sm text-slate-600">
          <li class="flex items-start gap-2">
            <UIcon name="heroicons-check-circle" class="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
            <span><strong>Score cards</strong> — Correct (blue), Wrong (red), and Accuracy percentage</span>
          </li>
          <li class="flex items-start gap-2">
            <UIcon name="heroicons-check-circle" class="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
            <span><strong>Review Answers</strong> — Go back through the lesson in review mode</span>
          </li>
          <li class="flex items-start gap-2">
            <UIcon name="heroicons-check-circle" class="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
            <span><strong>Explanations</strong> — Shown below questions in review mode (if provided by teacher)</span>
          </li>
          <li class="flex items-start gap-2">
            <UIcon name="heroicons-check-circle" class="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
            <span><strong>Teachers</strong> — Can view all student submissions in a table with scores and dates</span>
          </li>
        </ul>
      </div>
    </section>

    <!-- Section 8: Subscription -->
    <section id="subscription" class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="p-8 space-y-5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center ring-1 ring-teal-100">
            <UIcon name="heroicons-credit-card" class="h-5 w-5 text-teal-600" />
          </div>
          <h2 class="text-2xl font-semibold text-slate-900">Subscription Plans</h2>
        </div>
        <p class="text-slate-600 leading-relaxed">
          Teachers can upgrade their subscription to unlock more classes, students, and lessons.
          Choose between <strong>Starter</strong> (free), <strong>Medium</strong>, and <strong>Enterprise</strong> plans.
          Toggle between monthly and yearly billing — yearly saves 10%. Payment is handled securely via Stripe.
        </p>
        <div class="rounded-xl border border-slate-100 overflow-hidden bg-slate-50 p-4">
          <img
            src="/image/guide/subscription-plans.svg"
            alt="Subscription page showing three plan cards (Starter, Medium, Enterprise) with pricing and feature lists"
            class="w-full h-48 object-contain"
          />
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm border-collapse">
            <thead>
              <tr class="border-b border-slate-200">
                <th class="text-left py-2 pr-4 font-semibold text-slate-700">Feature</th>
                <th class="text-center py-2 px-4 font-semibold text-slate-700">Starter</th>
                <th class="text-center py-2 px-4 font-semibold text-blue-700">Medium</th>
                <th class="text-center py-2 px-4 font-semibold text-violet-700">Enterprise</th>
              </tr>
            </thead>
            <tbody class="text-slate-600">
              <tr class="border-b border-slate-100">
                <td class="py-2 pr-4">Classes</td>
                <td class="text-center py-2 px-4">1</td>
                <td class="text-center py-2 px-4">10</td>
                <td class="text-center py-2 px-4">Unlimited</td>
              </tr>
              <tr class="border-b border-slate-100">
                <td class="py-2 pr-4">Students per class</td>
                <td class="text-center py-2 px-4">10</td>
                <td class="text-center py-2 px-4">50</td>
                <td class="text-center py-2 px-4">Unlimited</td>
              </tr>
              <tr class="border-b border-slate-100">
                <td class="py-2 pr-4">Lessons per class</td>
                <td class="text-center py-2 px-4">5</td>
                <td class="text-center py-2 px-4">20</td>
                <td class="text-center py-2 px-4">Unlimited</td>
              </tr>
              <tr>
                <td class="py-2 pr-4">Price (monthly)</td>
                <td class="text-center py-2 px-4 font-medium">Free</td>
                <td class="text-center py-2 px-4 font-medium text-blue-700">$19/mo</td>
                <td class="text-center py-2 px-4 font-medium text-violet-700">$49/mo</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- Section 9: Profile -->
    <section id="profile" class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="p-8 space-y-5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center ring-1 ring-sky-100">
            <UIcon name="heroicons-user-circle" class="h-5 w-5 text-sky-600" />
          </div>
          <h2 class="text-2xl font-semibold text-slate-900">Your Profile</h2>
        </div>
        <p class="text-slate-600 leading-relaxed">
          Your profile page lets you manage how others see you on the platform. Update your <strong>display name</strong>
          and <strong>bio</strong> to personalize your presence. The account panel shows your email, roles, status,
          and membership date. Your avatar is automatically generated from your display name initial.
        </p>
        <div class="rounded-xl border border-slate-100 overflow-hidden bg-slate-50 p-4">
          <img
            src="/image/guide/profile-page.svg"
            alt="Profile page showing the avatar card with roles, edit form for display name and bio, and account details panel"
            class="w-full h-48 object-contain"
          />
        </div>
        <ul class="space-y-2 text-sm text-slate-600">
          <li class="flex items-start gap-2">
            <UIcon name="heroicons-check-circle" class="h-5 w-5 text-sky-500 shrink-0 mt-0.5" />
            <span><strong>Profile card</strong> — Shows your avatar, name, email, roles (Student/Teacher/Admin), and status</span>
          </li>
          <li class="flex items-start gap-2">
            <UIcon name="heroicons-check-circle" class="h-5 w-5 text-sky-500 shrink-0 mt-0.5" />
            <span><strong>Edit form</strong> — Change your display name and bio, then click "Save Changes"</span>
          </li>
          <li class="flex items-start gap-2">
            <UIcon name="heroicons-check-circle" class="h-5 w-5 text-sky-500 shrink-0 mt-0.5" />
            <span><strong>Account details</strong> — Read-only info: email, status, member since, user ID</span>
          </li>
          <li class="flex items-start gap-2">
            <UIcon name="heroicons-check-circle" class="h-5 w-5 text-sky-500 shrink-0 mt-0.5" />
            <span><strong>Reset button</strong> — Reverts unsaved changes back to your current profile</span>
          </li>
        </ul>
      </div>
    </section>

    <!-- Section: Interactive Walkthrough -->
    <section id="walkthrough" class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="p-8 space-y-5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center ring-1 ring-amber-100">
            <UIcon name="heroicons-cursor-arrow-rays" class="h-5 w-5 text-amber-600" />
          </div>
          <h2 class="text-2xl font-semibold text-slate-900">Interactive Walkthrough</h2>
        </div>
        <p class="text-slate-600 leading-relaxed">
          BrainLib features an interactive walkthrough system that guides you through each page on your first visit.
          A highlighted overlay will appear around key elements with step-by-step tooltips explaining what each part does.
          You must navigate through all steps to complete the tutorial.
        </p>
        <div class="rounded-xl border border-slate-100 overflow-hidden bg-slate-50 p-4">
          <img
            src="/image/guide/walkthrough-tooltip.svg"
            alt="Interactive walkthrough showing a highlighted element with a tooltip overlay explaining the Create Class button"
            class="w-full h-52 object-contain"
          />
        </div>
        <div class="bg-amber-50 border border-amber-100 rounded-xl p-4">
          <div class="flex items-start gap-3">
            <UIcon name="heroicons-light-bulb" class="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
            <div class="text-sm text-amber-800 space-y-1">
              <p class="font-medium">Tips:</p>
              <ul class="space-y-1 list-disc list-inside text-amber-700">
                <li>The walkthrough appears automatically on your first visit to each page</li>
                <li>You cannot close it until all steps are completed</li>
                <li>Use <strong>Previous</strong> and <strong>Next</strong> buttons to navigate steps</li>
                <li>Once completed, it won't appear again on that page</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <div class="text-center space-y-4 pb-4">
      <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-600 text-sm">
        <UIcon name="heroicons-sparkles" class="h-4 w-4" />
        <span>You're all set! Start exploring BrainLib.</span>
      </div>
      <p class="text-sm text-slate-500">
        Need more help? Contact your teacher or administrator for assistance.
      </p>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'blank',
})
</script>
