<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
      <teleport to="body">
        <ToastGroup />
      </teleport>
    </NuxtLayout>
  </div>
</template>
