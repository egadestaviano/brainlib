<template>
    <div>
        <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-indigo-600 text-white px-4 py-2 rounded-lg">
            Skip to content
        </a>
        
        <!-- Header -->
        <PartialLandingHeader/>
        
        <main id="main-content">
            <slot />
        </main>

        <!-- Footer -->
        <PartialLandingFooter />
    </div>
</template>