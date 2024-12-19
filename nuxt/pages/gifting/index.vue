<template>
  <div>
    <component :is="component" v-if="story" :blok="story.content" />
    <section>
      <GiftingStepsNavigation
        @update-step="updateStep"
        :active-step="activeStep"
      />
      <div>
        <GiftingPackagingStep
          v-show="activeStep === 1"
          @update-step="updateStep"
        />
        <GiftingShoppingStep
          v-show="activeStep === 2"
          @update-step="updateStep"
        />
        <GiftingMessageStep
          v-show="activeStep === 3"
          @update-step="updateStep" />
        <GiftingReviewStep
          v-show="activeStep === 4"
          @update-step="updateStep"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
const route = useRoute();
const router = useRouter();
const activeStep = ref(1);
const { giftingPackaging, giftingProductList, giftingMessage } = useGiftCart();
const step = route.query.step;
const version = route.query._storyblok || route.isDev ? "draft" : "published";
const story = await useStoryblok('gifting', {
  version: version
});
const component = resolveComponent(story.value.content.component)

function updateStep(stepNumber) {
  if (!giftingPackaging.value) {
    stepNumber = 1
  } else if (!giftingProductList.value.length && stepNumber != 1) {
    stepNumber = 2
  } else if (!giftingMessage.value && stepNumber == 4) {
    stepNumber = 3
  }
  activeStep.value = stepNumber;
  updateStepHash(stepNumber);
}

function updateStepHash(stepNumber) {
  router.replace({
    query: {
      step: stepNumber,
    },
  });
}

onMounted(() => {
  if (step && parseInt(step) >= 1 && parseInt(step) <= 4) {
    if (!giftingPackaging.value || step == 1) {
      updateStep(1)
    } else if (!giftingProductList.value.length && step != 1) {
      updateStep(2)
    } else if (!giftingMessage.value && step == 4) {
      updateStep(3)
    } else {
      activeStep.value = parseInt(step);
    }
  }
});
</script>