<template>
  <div class="max-w-4xl mx-auto space-y-12">
    <!-- Page Header -->
    <div class="text-center space-y-3">
      <h1 class="text-4xl font-bold tracking-tight text-slate-900">Getting Started with BrainLib</h1>
      <p class="text-lg text-slate-600 max-w-2xl mx-auto">
        A quick guide to help you navigate the platform and make the most of your learning experience.
      </p>
    </div>

    <!-- Section 1: Classes -->
    <section class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="p-8 space-y-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center ring-1 ring-blue-100">
            <UIcon name="heroicons-academic-cap" class="h-5 w-5 text-blue-600" />
          </div>
          <h2 class="text-2xl font-semibold text-slate-900">Managing Your Classes</h2>
        </div>
        <p class="text-slate-600 leading-relaxed">
          Classes are the core of BrainLib. As a teacher, you can create classes and share a unique code with your students.
          As a student, you can join classes using the code provided by your teacher. Each class contains lessons,
          materials, and activities organized by your instructor.
        </p>
        <div class="rounded-xl border border-slate-100 overflow-hidden bg-slate-50 p-4">
          <img
            src="/image/guide/classes-overview.svg"
            alt="Screenshot showing the classes page with a grid of class cards, each displaying the class name, description, instructor, and student count"
            class="w-full h-48 object-contain"
          />
        </div>
        <ul class="space-y-2 text-sm text-slate-600">
          <li class="flex items-start gap-2">
            <UIcon name="heroicons-check-circle" class="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
            <span>Create or join classes from the Classes page</span>
          </li>
          <li class="flex items-start gap-2">
            <UIcon name="heroicons-check-circle" class="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
            <span>Use the sidebar to quickly switch between your enrolled classes</span>
          </li>
          <li class="flex items-start gap-2">
            <UIcon name="heroicons-check-circle" class="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
            <span>Click any class card to view lessons and materials</span>
          </li>
        </ul>
      </div>
    </section>

    <!-- Section 2: Navigation -->
    <section class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="p-8 space-y-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center ring-1 ring-violet-100">
            <UIcon name="heroicons-bars-3" class="h-5 w-5 text-violet-600" />
          </div>
          <h2 class="text-2xl font-semibold text-slate-900">Navigating the Platform</h2>
        </div>
        <p class="text-slate-600 leading-relaxed">
          The sidebar on the left provides quick access to all your classes and key sections of the platform.
          It collapses automatically to give you more workspace, and expands when you hover over it.
          The class list in the sidebar shows all your enrolled classes for quick navigation.
        </p>
        <div class="rounded-xl border border-slate-100 overflow-hidden bg-slate-50 p-4">
          <img
            src="/image/guide/navigation-sidebar.svg"
            alt="Screenshot showing the sidebar navigation with the classes link expanded to reveal a list of enrolled classes"
            class="w-full h-48 object-contain"
          />
        </div>
        <ul class="space-y-2 text-sm text-slate-600">
          <li class="flex items-start gap-2">
            <UIcon name="heroicons-check-circle" class="h-5 w-5 text-violet-500 shrink-0 mt-0.5" />
            <span>Hover over the sidebar to expand it and see class names</span>
          </li>
          <li class="flex items-start gap-2">
            <UIcon name="heroicons-check-circle" class="h-5 w-5 text-violet-500 shrink-0 mt-0.5" />
            <span>Click the chevron to expand or collapse the class list</span>
          </li>
          <li class="flex items-start gap-2">
            <UIcon name="heroicons-check-circle" class="h-5 w-5 text-violet-500 shrink-0 mt-0.5" />
            <span>Access your profile and subscription from the footer navigation</span>
          </li>
        </ul>
      </div>
    </section>

    <!-- Section 3: Profile -->
    <section class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="p-8 space-y-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center ring-1 ring-sky-100">
            <UIcon name="heroicons-user-circle" class="h-5 w-5 text-sky-600" />
          </div>
          <h2 class="text-2xl font-semibold text-slate-900">Your Profile</h2>
        </div>
        <p class="text-slate-600 leading-relaxed">
          Your profile page lets you manage how others see you on the platform. Update your display name and bio
          to personalize your presence. You can also view your account details including your roles, status,
          and membership information.
        </p>
        <div class="rounded-xl border border-slate-100 overflow-hidden bg-slate-50 p-4">
          <img
            src="/image/guide/profile-page.svg"
            alt="Screenshot showing the profile page with the avatar card, edit form for display name and bio, and account details panel"
            class="w-full h-48 object-contain"
          />
        </div>
        <ul class="space-y-2 text-sm text-slate-600">
          <li class="flex items-start gap-2">
            <UIcon name="heroicons-check-circle" class="h-5 w-5 text-sky-500 shrink-0 mt-0.5" />
            <span>Edit your display name and bio from the profile page</span>
          </li>
          <li class="flex items-start gap-2">
            <UIcon name="heroicons-check-circle" class="h-5 w-5 text-sky-500 shrink-0 mt-0.5" />
            <span>View your roles (Student, Teacher, Admin) and account status</span>
          </li>
          <li class="flex items-start gap-2">
            <UIcon name="heroicons-check-circle" class="h-5 w-5 text-sky-500 shrink-0 mt-0.5" />
            <span>Your profile avatar is generated from your display name initial</span>
          </li>
        </ul>
      </div>
    </section>

    <!-- Footer -->
    <div class="text-center pb-8">
      <p class="text-sm text-slate-500">
        Need more help? Contact your teacher or administrator for assistance.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
})
</script>
