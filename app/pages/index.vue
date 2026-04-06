<script setup>
definePageMeta({
    layout: 'landing'
})

useSeoMeta({
  title: 'Home',
  ogTitle: 'BrainLib - Smart Learning Management System',
  description: 'Welcome to BrainLib, the smart AI-driven LMS for modern education. Manage assessments and analytics in one place.',
  ogDescription: 'Welcome to BrainLib, the smart AI-driven LMS for modern education.',
})
</script>

<template>
    <!-- Hero -->
    <LandingpageHero/>

    <!-- Content -->
    <LandingpageContent/>

    <!-- Feature -->
    <LandingpageFeatures/>
   
    <!-- Price -->
    <LandingpageCTA/>
</template>
