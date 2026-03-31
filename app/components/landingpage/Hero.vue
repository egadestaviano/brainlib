<template>
      <section class="relative overflow-hidden bg-white pt-32 pb-32">
        <div
            class="absolute top-0 left-1/2 -z-10 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-teal-50/50 blur-3xl">
        </div>

        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="grid md:grid-cols-2 items-center gap-16">
                <div class="text-center md:text-left">
                    <h1 class="text-5xl py-1.5 sm:text-6xl font-extrabold text-gray-900 leading-[1.1] animate-in slide-in-from-bottom duration-1000">
                        Smart Learning
                        <span class="relative inline-block">
                            <span class="relative z-10 text-[#4338CA]">Management System (LMS)</span>
                            <span class="absolute bottom-2 left-0 h-3 w-full bg-teal-100 -z-10"></span>
                        </span>
                    </h1>

                    <p class="mt-8 text-gray-600 text-xl leading-relaxed animate-in slide-in-from-bottom duration-1000 delay-200">
                        Automate assessment generation, track real-time analytics, and unify the educational experience
                        for admins, teachers, and students in one powerful AI-driven system.
                    </p>

                    <div class="mt-10 flex flex-col sm:flex-row justify-center md:justify-start gap-4 animate-in fade-in duration-1000 delay-500">
                        <NuxtLink to="/auth/register"
                            class="group relative inline-flex items-center justify-center overflow-hidden rounded-xl  bg-indigo-600 px-8 py-4 font-bold text-white transition-all focus:outline-none hover:scale-105 active:scale-95">
                            Get Started Now
                        </NuxtLink>
                    </div>
                </div>

                <div class="relative animate-in slide-in-from-right duration-1000">
                    <div class="relative z-10 overflow-hidden rounded-2xl transition hover:scale-[1.02] shadow-2xl">
                        <img src="/image/image_banner.svg"
                            alt="AI Learning Platform" class="w-full object-cover animate-float">
                    </div>
                    <div class="absolute -bottom-6 -right-6 -z-10 h-64 w-64 rounded-2xl bg-teal-500/10 animate-pulse-soft"></div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
}

@keyframes pulse-soft {
  0% { transform: scale(1); opacity: 0.4; }
  50% { transform: scale(1.05); opacity: 0.6; }
  100% { transform: scale(1); opacity: 0.4; }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-pulse-soft {
  animation: pulse-soft 4s ease-in-out infinite;
}

/* Fallback for Tailwind's animate-in if not configured */
.animate-in {
  animation-fill-mode: forwards;
}

.slide-in-from-bottom {
  animation: slide-up 0.8s ease-out;
}

@keyframes slide-up {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style>

