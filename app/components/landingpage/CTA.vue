<template>
 <section class="relative overflow-hidden bg-indigo-600 py-24">
    <div class="absolute inset-0">
        <div class="absolute top-0 left-1/2 -translate-x-1/2 h-[400px] w-[800px] bg-indigo-400/30 blur-3xl rounded-full animate-pulse-slow"></div>
    </div>

    <div class="relative mx-auto max-w-4xl px-6 text-center animate-in slide-in-from-bottom duration-1000">
        <h2 class="text-4xl sm:text-5xl font-extrabold text-white leading-tight">
            Ready to Transform Your Learning Experience?
        </h2>

        <p class="mt-6 text-lg text-indigo-100 leading-relaxed">
            Start using BrainLib today and experience AI-powered learning, smarter assessments, and real-time insights.
        </p>

        <div class="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <NuxtLink to="/auth/register"
                class="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 font-bold text-indigo-600 hover:bg-gray-100 transition btn-anim shadow-lg">
                Get Started Free
            </NuxtLink>
        </div>
    </div>
</section>
</template>

<style scoped>
@keyframes pulse-slow {
  0%, 100% { opacity: 0.2; transform: translate(-50%, 0) scale(1); }
  50% { opacity: 0.4; transform: translate(-50%, -10px) scale(1.05); }
}

.animate-pulse-slow {
  animation: pulse-slow 6s ease-in-out infinite;
}

.animate-in {
  animation-fill-mode: forwards;
}

@keyframes slide-up {
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.slide-in-from-bottom {
  animation: slide-up 0.8s ease-out;
}
</style>