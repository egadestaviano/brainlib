import { useAuthStore } from "~/stores/auth"
import { useLmsClassStore } from "~/stores/lmsclass"

export function usePermissions() {
  const authStore = useAuthStore()
  const lmsClassStore = useLmsClassStore()

  const user = computed(() => authStore.user)
  const classDetail = computed(() => lmsClassStore.classDetail)

  // Global admin check
  const isGlobalAdmin = computed(() => {
    return user.value?.roles?.includes("admin") ?? false
  })

  // Global student check
  const isGlobalStudent = computed(() => {
    return user.value?.roles?.includes("student") ?? false
  })

  // Class-specific membership role
  const myMembership = computed(() => {
    if (!classDetail.value || !user.value) return null
    return classDetail.value.memberships?.find(
      (m: any) => m.user.id === user.value?.id
    )
  })

  // Is class creator (and not a student)
  const isClassCreator = computed(() => {
    if (!classDetail.value || !user.value) return false
    if (isGlobalStudent.value) return false
    return classDetail.value.creator.id === user.value.id
  })

  // Can manage lessons: create, edit, delete
  const canManageLessons = computed(() => {
    if (!user.value) return false
    
    // 1. Global Admin always allowed
    if (isGlobalAdmin.value) return true

    // 2. Global Student always restricted
    if (isGlobalStudent.value) return false

    if (!classDetail.value) return false

    // 3. Class creator allowed (if not a student)
    if (isClassCreator.value) return true

    // 4. Check membership role in this class
    return myMembership.value?.role === "teacher" || myMembership.value?.role === "admin"
  })

  // Is teacher or admin (for any class-related management)
  const isTeacherOrAdmin = computed(() => {
    if (!user.value) return false
    
    // Global admin
    if (isGlobalAdmin.value) return true

    if (!classDetail.value) return false

    // Class creator
    if (isClassCreator.value) return true

    // Membership role
    return myMembership.value?.role === "teacher" || myMembership.value?.role === "admin"
  })

  // Is student (can fill out lessons, take quizzes)
  const isStudent = computed(() => {
    if (!user.value) return false
    
    // Global student
    if (isGlobalStudent.value) return true

    if (!classDetail.value) return false

    // Check membership role - if explicitly student
    return myMembership.value?.role === "student"
  })

  return {
    isGlobalAdmin,
    isGlobalStudent,
    isClassCreator,
    myMembership,
    canManageLessons,
    isTeacherOrAdmin,
    isStudent,
  }
}
