<template>
     <section class="py-24 bg-gray-50">
        <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
            <div class="mx-auto max-w-2xl text-center">
                <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Choose the Perfect Plan</h2>
                <p class="mt-4 text-lg text-gray-600">
                    Empowering educators and unlocking student potential within a seamless, all-in-one ecosystem.
                </p>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-12 sm:items-stretch md:grid-cols-3 md:gap-8">
                <div class="divide-y divide-gray-200 rounded-2xl border border-gray-200 shadow-xs">
                    <div class="p-6 sm:px-8">
                        <h2 class="text-lg font-medium text-gray-900">
                            Free
                            <span class="sr-only">Plan</span>
                        </h2>

                        <p class="mt-2 text-pretty text-gray-700">
                            Free plan for beginners. Access to basic features.
                        </p>

                        <p class="mt-2 sm:mt-4">
                            <strong class="text-3xl font-bold text-gray-900 sm:text-4xl"> 0$ </strong>

                            <span class="text-sm font-medium text-gray-700">/month</span>
                        </p>
                        <NuxtLink to="/auth/register" class="mt-4 block rounded-sm border border-indigo-600 bg-indigo-600 px-12 py-3 text-center
                            text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 sm:mt-6">
                            Get Started
                        </NuxtLink>
                    </div>
                </div>

                <div class="divide-y divide-gray-200 rounded-2xl border border-gray-200 shadow-xs">
                    <div class="p-6 sm:px-8">
                        <h2 class="text-lg font-medium text-gray-900">
                            Pro
                            <span class="sr-only">Plan</span>
                        </h2>

                        <p class="mt-2 text-pretty text-gray-700">
                            Pro plan with full feature access,
                            flexibility, and maximum performance.
                        </p>

                        <p class="mt-2 sm:mt-4">
                            <strong class="text-3xl font-bold text-gray-900 sm:text-4xl"> 5.83$ </strong>

                            <span class="text-sm font-medium text-gray-700">/month</span>
                        </p>

                        <NuxtLink to="/auth/register" class="mt-4 block rounded-sm border border-indigo-600 bg-indigo-600 px-12 py-3 text-center
                            text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 sm:mt-6">
                            Get Started
                        </NuxtLink>
                    </div>
                </div>

                <div class="divide-y divide-gray-200 rounded-2xl border border-gray-200 shadow-xs">
                    <div class="p-6 sm:px-8">
                        <h2 class="text-lg font-medium text-gray-900">
                            Business
                            <span class="sr-only">Plan</span>
                        </h2>

                        <p class="mt-2 text-pretty text-gray-700">
                            Business plan with advanced features and priority support.
                        </p>

                        <p class="mt-2 sm:mt-4">
                            <strong class="text-3xl font-bold text-gray-900 sm:text-4xl"> 17.60$ </strong>

                            <span class="text-sm font-medium text-gray-700">/month</span>
                        </p>

                        <NuxtLink to="/auth/register" class="mt-4 block rounded-sm border border-indigo-600 bg-indigo-600 px-12 py-3 text-center
                            text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 sm:mt-6">
                            Get Started
                        </NuxtLink>
                    </div>
                    
                </div>
            </div>
        </div>
    </section>
</template>