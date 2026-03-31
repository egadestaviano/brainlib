<template>
     <header :class="['bg-gray-50 fixed top-0 z-9999999 w-full ...', hidden ? '-translate-y-full' : 'translate-y-0']">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="flex h-16 items-center justify-between">
                <div class="md:flex md:items-center md:gap-6">
                    <NuxtLink class="block text-[#4338CA] flex items-center gap-10" to="/">
                        <span class="sr-only">Home</span>
                        <span class="text-2xl py-1.5 font-extrabold text-gray-900 leading-[1.1]">BrainLib</span>
                    </NuxtLink>
                </div>

                <div class="flex items-center gap-4">
                    <div class="sm:flex sm:gap-4">
                        <NuxtLink to="/auth/login"
                            class="rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm"
                            href="#">
                            Login
                        </NuxtLink>

                        <div class="hidden sm:flex">
                            <NuxtLink to="/auth/register"
                                class="rounded-md bg-gray-100 px-5 py-2.5 text-sm font-medium text-[#4338CA]" href="#">
                                Register
                            </NuxtLink>
                        </div>
                    </div>

                    <div class="block md:hidden">
                        <button class="rounded-sm bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600/75">
                            <svg xmlns="http://www.w3.org/2000/svg" class="size-5" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup>
const hidden = ref(false);
const lastScroll = ref(0);

const handleScroll = () => {
    const current = window.scrollY;

    if (Math.abs(current - lastScroll.value) < 10) return;

    hidden.value = current > lastScroll.value && current > 100;

    lastScroll.value = current;
};

onMounted(() => {
    window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});
</script>