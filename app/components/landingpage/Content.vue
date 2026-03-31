<template>
    <section class="bg-gray-50 py-24 overflow-hidden" id="about">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="grid md:grid-cols-2 items-center gap-12 lg:gap-24">
                <div class="order-2 md:order-1 animate-in slide-in-from-left duration-1000">
                    <img src="/image/image_banner2.svg"
                        class="rounded-3xl shadow-xl animate-float-slow" alt="System Infrastructure" />
                </div>

                <div class="order-1 md:order-2 space-y-6 animate-in slide-in-from-right duration-1000">
                    <h2 class="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl leading-tight">
                        Integrated <span class="text-[#4338CA]"> Learning </span> & Management
                    </h2>
                    <p class="mt-6 text-lg text-gray-600 leading-relaxed">
                        Our system infrastructure syncs AI generation with real-time user tracking.
                        Every interaction is processed through our data engine to provide actionable insights for all
                        user roles.
                    </p>

                    <div class="mt-8">
                        <ul class="space-y-4">
                            <li class="flex items-start gap-3 font-medium text-gray-700 hover:translate-x-2 transition-transform duration-300">
                                <div class="mt-1 p-1 bg-teal-100 rounded-full text-[#4338CA]">
                                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clip-rule="evenodd"></path>
                                    </svg>
                                </div>
                                <div>
                                    <span class="block text-gray-900 font-bold">Automated Data Pipelines</span>
                                    <span class="text-sm text-gray-600 font-normal">Real-time synchronization of student
                                        grades, progress logs, and AI-generated assessment results.</span>
                                </div>
                            </li>
                            <li class="flex items-start gap-3 font-medium text-gray-700 hover:translate-x-2 transition-transform duration-300">
                                <div class="mt-1 p-1 bg-teal-100 rounded-full text-[#4338CA]">
                                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clip-rule="evenodd"></path>
                                    </svg>
                                </div>
                                <div>
                                    <span class="block text-gray-900 font-bold">AI Processing Engine</span>
                                    <span class="text-sm text-gray-600 font-normal">Our backend uses LLM integration to
                                        transform raw curriculum data into structured exam patterns instantly.</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
@keyframes float-slow {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-12px) rotate(1deg); }
}

.animate-float-slow {
  animation: float-slow 7s ease-in-out infinite;
}

.animate-in {
  animation-fill-mode: forwards;
}

.slide-in-from-left {
  animation: slide-left 0.8s ease-out;
}

.slide-in-from-right {
  animation: slide-right 0.8s ease-out;
}

@keyframes slide-left {
  from { transform: translateX(-30px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes slide-right {
  from { transform: translateX(30px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
</style>