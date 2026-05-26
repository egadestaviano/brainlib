<template>
     <header :class="['bg-gray-50/80 backdrop-blur-md fixed top-0 z-50 w-full transition-transform duration-300', hidden ? '-translate-y-full' : 'translate-y-0']" aria-label="Main Navigation">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="flex h-16 items-center justify-between">
                <div class="md:flex md:items-center md:gap-6">
                    <NuxtLink class="block text-[#4338CA] flex items-center gap-2 focus:outline-offset-4 focus:rounded-sm" to="/">
                        <span class="sr-only">Go to Home</span>
                        <span class="text-2xl py-1.5 font-extrabold text-gray-900 leading-[1.1]">BrainLib</span>
                    </NuxtLink>
                </div>

                <nav class="flex items-center gap-4" aria-label="Sign in and Sign up menu">
                    <div class="flex gap-2 sm:gap-4">
                        <NuxtLink to="/auth/login"
                            data-walkthrough="landing-login-btn"
                            class="rounded-md bg-indigo-600 px-4 sm:px-5 py-2 sm:py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition"
                            title="Sign in to your account">
                            Login
                        </NuxtLink>

                        <NuxtLink to="/auth/register"
                            class="rounded-md bg-gray-100 px-4 sm:px-5 py-2 sm:py-2.5 text-sm font-medium text-[#4338CA] hover:bg-gray-200 transition" 
                            title="Create a new account">
                            Register
                        </NuxtLink>
                    </div>
                </nav>
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