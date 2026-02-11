<template>
  <header class="flex items-center justify-between px-6 py-3 bg-white shadow-sm">
    <div class="flex items-center gap-4">
      <button @click="sidebar.toggleCollapse" class="p-1 rounded hover:bg-slate-100">
        <UIcon name="heroicons-bars-3" class="h-6 w-6 text-slate-700" />
      </button>
    </div>

    <div class="flex items-center gap-3">
      <UPopover placement="bottom-end" arrow>
        <UTooltip text="Create or join a class">
          <UButton size="sm" variant="ghost" class="p-2 rounded-full cursor-pointer">
            <UIcon name="heroicons-plus" class="h-4 w-4 text-slate-700" />
          </UButton>
        </UTooltip>

        <template #content>
          <div class="w-32 p-3">
            <nav class="flex flex-col">

              <!-- Create class modal -->
              <UModal v-model:open="modalCreate" title="Create New Class">
                <UButton color="neutral" variant="ghost" class="justify-start cursor-pointer">
                  Create class
                </UButton>
                <template #content>
                  <UCard>
                    <UForm :schema="schema" :state="state" class="space-y-4 w-full" @submit="handleSubmit">
                      <UFormField label="Title" name="title" class="w-full">
                        <UInput v-model="state.title" placeholder="Enter class title" class="w-full" />
                      </UFormField>

                      <UFormField label="Description" name="description" class="w-full">
                        <UTextarea v-model="state.description" placeholder="Enter class description" :rows="3"
                          class="w-full" />
                      </UFormField>

                      <div class="flex justify-end gap-2">
                        <UButton @click.prevent="handleCancel" type="button" color="secondary" variant="soft">
                          Cancel
                        </UButton>
                        <UButton type="submit" color="primary" :loading="LmsClassStore.loading">
                          Create
                        </UButton>
                      </div>
                    </UForm>
                  </UCard>
                </template>
              </UModal>

              <!-- Join class modal -->
              <UModal v-model:open="modalJoin" title="Join Class">
                <UButton color="neutral" variant="ghost" class="justify-start cursor-pointer">
                  Join class
                </UButton>
                <template #content>
                  <UCard>
                    <UForm :schema="joinSchema" :state="joinClassState" class="space-y-4 w-full"
                      @submit="handleJoinClass">
                      <UFormField label="Class Code" name="code" class="w-full">
                        <UInput v-model="joinClassState.code" placeholder="Enter class code" class="w-full" />
                      </UFormField>

                      <div v-if="LmsClassStore.error">
                        {{ LmsClassStore.error }}
                      </div>

                      <div class="flex justify-end gap-2">
                        <UButton @click.prevent="handleCancelJoin" type="button" color="secondary" variant="soft">
                          Cancel
                        </UButton>
                        <UButton type="submit" color="primary" :loading="LmsClassStore.loading">
                          Join
                        </UButton>
                      </div>
                    </UForm>
                  </UCard>
                </template>
              </UModal>

            </nav>
          </div>
        </template>
      </UPopover>

      <!-- User popover -->
      <UPopover placement="bottom-end" arrow>
        <UTooltip text="My Account">
          <UButton
            class="cursor-pointer w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 text-white flex items-center justify-center font-medium focus:outline-none">
            {{ auth?.user?.profile?.display_name?.charAt(0)?.toUpperCase() || '' }}
          </UButton>
        </UTooltip>

        <template #content>
          <div class="w-64 p-3">
            <div class="flex items-center gap-3 p-3">
              <div
                class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 text-white flex items-center justify-center font-medium">
                {{ auth?.user?.profile?.display_name?.charAt(0)?.toUpperCase() || 'A' }}
              </div>
              <div class="flex flex-col">
                <span class="text-sm font-medium text-slate-800">{{ auth?.user?.profile?.display_name }}</span>
                <span class="text-xs text-slate-500">{{ auth?.user?.email }}</span>
              </div>
            </div>
            <div class="my-2 border-t border-slate-100"></div>
            <nav class="flex flex-col">
              <UButton color="neutral" variant="ghost" class="justify-start cursor-pointer">Profile</UButton>
              <UButton color="neutral" variant="ghost" class="justify-start cursor-pointer">Settings</UButton>
              <UButton color="error" variant="ghost" class="justify-start cursor-pointer" @click.prevent="handleLogout">
                Logout
              </UButton>
            </nav>
          </div>
        </template>
      </UPopover>
    </div>
  </header>
</template>

<script setup lang="ts">
import * as v from 'valibot'
import type { FormSubmitEvent } from '@nuxt/ui'

const sidebar = useSidebarStore()
const auth = useAuthStore()
const toast = useToast()
const LmsClassStore = useLmsClassStore()

const schema = v.object({
  title: v.pipe(v.string(), v.minLength(1, 'Title is required')),
  description: v.pipe(v.string(), v.minLength(1, 'Description is required')),
})

const joinSchema = v.object({
  code: v.pipe(v.string(), v.minLength(1, 'Class code is required')),
})

type Schema = v.InferOutput<typeof schema>
type JoinClassSchema = v.InferOutput<typeof joinSchema>

const modalCreate = ref(false)
const modalJoin = ref(false)

const state = reactive<CreateLmsClass>({
  title: '',
  description: '',
})

const joinClassState = reactive({
  code: '',
})

const handleCancel = () => {
  state.title = ''
  state.description = ''
  modalCreate.value = false
}

const handleCancelJoin = () => {
  joinClassState.code = ''
  modalJoin.value = false
}

const handleSubmit = async (event: FormSubmitEvent<Schema>) => {
  try {
    await LmsClassStore.createClass(event.data)
    modalCreate.value = false
    toast.add({ title: 'Class created successfully', color: 'success' })
  } catch (error: any) {
    toast.add({ title: LmsClassStore.error || 'Failed to create class', color: 'error' })
  }
}

const handleJoinClass = async (event: FormSubmitEvent<JoinClassSchema>) => {
  try {
    await LmsClassStore.joinClassByCode(event.data.code)
    modalJoin.value = false
    toast.add({ title: 'Joined class successfully', color: 'success' })
  } catch (error: any) {
    toast.add({ title: LmsClassStore.error || 'Failed to join class', color: 'error' })
  }
}

async function handleLogout() {
  await auth.logout()
  navigateTo('/auth/login')
}
</script>
