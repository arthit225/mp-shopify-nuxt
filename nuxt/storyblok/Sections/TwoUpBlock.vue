<template>
  <section
    v-editable="blok"
    :data-id="blok._uid"
    :data-component="blok.component"
    :id="blok._uid"
    v-if="blok"
    class="two-up-block"
  >
    <div class="flex flex-col flex-wrap md:flex-row futura-std-regular text-center">
      <div
        v-for="item in blok.up_blocks"
        :key="item._uuid"
        ref="itemRef"
        class="
          two-up-block__left-part
          p-16
          lg-down:px-8
          md-down:py-10 md-down:px-4
          w-full
          md:w-1/2
          bg-black
          text-white
        "
      >
        <div class="max-w-[33.125rem] mx-auto">
          <div
            v-if="item.float_title_subtitle_on_image"
            class="flex flex-col-reverse -mb-4 relative z-[1] text-center"
          >
            <h2
              v-if="item.title"
              class="saol-display-light h1 leading-none whitespace-pre-line heading-m"
            >
              {{ item.title }}
            </h2>
            <h3
              v-if="item.sub_title"
              class="text-xs leading-loose tracking-[2px] mb-1 futura-std-medium whitespace-pre-line"
            >
              {{ item.sub_title }}
            </h3>
          </div>

          <div class="two-up-block__image-wrapper max-w-[28.125rem] mx-auto mb-4">
            <lazyload-img
              v-if="isImage(item.media_asset.filename)"
              :widths="[600, 500, 300, 767, 640]"
              :breakpoints="[1400, 1200, 1024, 641, 640]"
              :key="item.media_asset.filename"
              :src="item.media_asset.filename"
              figureClasses="ratio-container block max-w-full mb-8"
              pictureClasses="w-full h-full block"
              imgClasses="block object-cover"
              :aspectRatio="1"
            />
            <figure
              v-else
              class="ratio-container ratio-container__video block max-w-full relative overflow-hidden mb-8"
            >
              <play-pause-video
                :preload="true"
                :autoplay="true"
                :muted="true"
                :playsinline="true"
                :loop="true"
                :class="'w-full h-full object-cover absolute top-0 left-0'"
              >
                <source :src="item.media_asset.filename">
              </play-pause-video>
            </figure>
          </div>

          <div class="
            text-medium
            leading-[1.375rem]
            md:leading-[1.688rem]
          ">
            <div
              v-if="!item.float_title_subtitle_on_image"
              class="flex flex-col-reverse mb-2.5 text-center"
            >
              <h2
                v-if="item.title"
                class="saol-display-light h1 leading-none whitespace-pre-line heading-m"
              >
                {{ item.title }}
              </h2>
              <h3
                v-if="item.sub_title"
                class="text-xs leading-loose tracking-[2px] mb-1 futura-std-medium whitespace-pre-line"
              >
                {{ item.sub_title }}
              </h3>
            </div>
            <p
              v-if="item.description"
              class="mb-6"
            >
              {{ item.description }}
            </p>
            <div
              v-if="item.cta_text && item.cta_link !=undefined"
              class="text-center"
            >
              <nuxt-link
                :to="item.cta_link.url ? item.cta_link.url : (item.cta_link.cached_url ? '/'+item.cta_link.cached_url : '/') + (item.cta_link.anchor ? '#' + item.cta_link.anchor : '')"
                class="button--primary inline-flex max-w-[163px]"
              >
                {{ item.cta_text }}
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const { blok } = defineProps({ blok: Object });
const { isImage } = useUtils();
const itemRef = ref()
const blokItem = blok.up_blocks

onMounted(() => {
  console.log(blok);
  if (!itemRef) return;
  itemRef.value.forEach((item, i)=> {
    if (!item) return;
    item.style.backgroundColor = blokItem[i].background_color.color
    item.classList.add(`bg-is-${blokItem[i].background_color.color == '#000000' ? 'black': 'not-black'}`)
    item.style.color = blokItem[i].text_color.color
    //item.querySelector('.button--primary').style.borderColor = blokItem[i].text_color.color
    //item.querySelector('.button--primary').style.color = blokItem[i].text_color.color
  })
});
</script>

<style lang="scss" scoped>
.bg-is-black {
  .button--primary {
    border: solid 1px white;
    color: white;
  }
  .button--primary:hover:not(.button--primary:hover[disabled]) {
    background: white !important;
    border-color: white !important;
    color: black !important;
}
}
.two-up-block {
  padding-top: 2rem;
  @screen md {
    @apply pt-20;
  }
  &__left-part {

  }

}
  .ratio-container {
    &__video {
      aspect-ratio: 1;
      padding-top: 100%;
    }
  }
</style>

<style>

</style>