<template>
   <section
    v-if="blok"
    v-editable="blok"
    :data-id="blok._uid"
    :data-component="blok.component"
    :id="blok._uid"
    class="booking-block"
    :class="[
      blok.secondary_layout ? 'booking-block__secondary md-down:pt-4' : 'pt-20',
    ]"
  >
    <div
      class="flex futura-std-regular text-center"
      :class="[
        blok.secondary_layout
          ? 'md:flex-row-reverse flex-col-reverse'
          : 'flex-col md:flex-row',
      ]"
    >
      <div
        class="
          booking-block__left-part
          w-full
          md:w-1/2
          text-white
        ">
    
        <div 
            class="hero relative flex"
            :class="[blok.use_inset_layout ? 'hero-inset-layout mx-7 md:mx-16 items-start' : 'px-5 md:px-10 justify-center items-center h-full']"
            >
            <figure class="absolute left-0 top-0 w-full h-full z-[-1]">
              <lazyload-img
                v-if="isImage(blok.first_image.filename)"
                :widths="[1400, 1200, 1024, 640]"
                :breakpoints="[1200, 1024, 641, 640]"
                :key="blok.first_image.filename"
                :src="blok.first_image.filename"
                :pictureClasses="'w-full h-full block'"
                :imgClasses="'w-full h-full object-cover absolute left-0 top-0'"
                :defaultRatio="true"
                />
                <play-pause-video
                v-else
                :preload="true"
                :muted="true"
                :playsinline="true"
                :loop="true"
                :autoplay="true"
                :class="'w-full h-full object-cover'"
                >
                <source :src="blok.first_image.filename">
                </play-pause-video>
            </figure>
            <article
                class="hero__caption flex flex-col justify-center text-mp-cream max-w-[428px]"
            >
                <div class="flex flex-col-reverse -mb-4 relative z-[1] text-center">
                    <h2 class="heading-m leading-none">
                        {{blok.first_title}}
                    </h2>
                    <h3
                    class="
                        text-xs
                        leading-loose
                        tracking-[2px]
                        mb-1
                        futura-std-medium"
                    >
                        {{blok.first_subtitle}}
                    </h3>
                </div>
                <div class="text-medium leading-[1.375rem] md:leading-[1.688rem] mt-6">
                    <p class="mb-6">
                    {{blok.first_description}}
                    </p>
                    <div class="flex flex-wrap gap-3 justify-center items-center">
                    <nuxt-link :to="'/'" class="button--primary-reverse inline-flex">
                      {{blok.first_buttontext}}
                    </nuxt-link>
                    </div>
                </div>
            </article>
        </div>

      </div>
      <div
        class="
          booking-block__right-part
          p-16
          lg-down:px-8
          md-down:py-10 md-down:px-4
          w-full
          md:w-1/2
          text-white
        "
        :class="[blok.secondary_layout ? '' : 'bg-black']"
      >
        <div v-if="blok.secondary_layout" class="max-w-[33.125rem] mx-auto">
          <div class="booking-block__image-wrapper max-w-[28.125rem] mx-auto">
            <lazyload-img
              v-if="isImage(blok.second_img.filename)"
              :widths="[600, 500, 300, 767, 640]"
              :breakpoints="[1400, 1200, 1024, 641, 640]"
              :key="blok.second_img.filename"
              :src="blok.second_img.filename"
              figureClasses="ratio-container block max-w-full"
              pictureClasses="w-full h-full block"
              imgClasses="block object-cover"
              :aspectRatio="0.7241"
            />
            <figure
              v-else
              class="
                ratio-container ratio-container__video
                block
                max-w-full
                relative
                overflow-hidden
              "
            >
              <play-pause-video
                :preload="true"
                :autoplay="true"
                :muted="true"
                :playsinline="true"
                :loop="true"
                :class="'w-full h-full object-cover absolute top-0 left-0'"
              >
                <source :src="blok.first_image.filename" />
              </play-pause-video>
            </figure>
          </div>
        </div>

        <div v-else class="max-w-[33.125rem] mx-auto">
          <div class="flex flex-col-reverse -mb-4 relative z-[1] text-center">
            <h2 class="heading-m leading-none">
                {{blok.second_title}}
            </h2>
            <h3
              class="
                text-xs
                leading-loose
                tracking-[2px]
                mb-1
                futura-std-medium
              "
            >
                {{blok.second_subtitle}}
            </h3>
          </div>

          <div class="booking-block__image-wrapper max-w-[28.125rem] mx-auto">
            <lazyload-img
              v-if="isImage(blok.second_img.filename)"
              :widths="[600, 500, 300, 767, 640]"
              :breakpoints="[1400, 1200, 1024, 641, 640]"
              :key="blok.second_img.filename"
              :src="blok.second_img.filename"
              figureClasses="ratio-container block max-w-full mb-8"
              pictureClasses="w-full h-full block"
              imgClasses="block object-cover"
              :aspectRatio="1"
            />
            <figure
              v-else
              class="
                ratio-container ratio-container__video
                block
                max-w-full
                relative
                overflow-hidden
                mb-8
              "
            >
              <play-pause-video
                :preload="true"
                :autoplay="true"
                :muted="true"
                :playsinline="true"
                :loop="true"
                :class="'w-full h-full object-cover absolute top-0 left-0'"
              >
                <source :src="blok.second_img.filename" />
              </play-pause-video>
            </figure>
          </div>

          <div class="text-medium leading-[1.375rem] md:leading-[1.688rem] mt-8">
            <p class="mb-8">
            {{blok.second_description}}
            </p>
            <div class="flex flex-wrap gap-3 justify-center items-center">
              <nuxt-link :to="'/'" class="button--primary-reverse inline-flex">
                {{blok.second_buttontext}}
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
let showDate = ref(false);
const todaysDate = new Date()
function revealDatePicker() {
  showDate.value = true
}
onMounted(() => {
  console.log("BookingBlock");
  console.log(blok);
});
</script>

<style lang="scss">
.booking-block {
  .ratio-container {
    aspect-ratio: 1;
  }
  // .button--primary-reverse {
  //   color: black;
  //   border-color: black;
  // }
  span {
    svg {
      width: 100%;
      height: 100%;
    }
  }

  select {
    appearance: none;
    -moz-appearance: none;
    -webkit-appearance: none;
    background-repeat: no-repeat;
    background-position: right;
    background-color: transparent;
    width: 100%;
    outline: none;
    text-align: center;
    background-size: 1rem;
    background-image: url("data:image/svg+xml,%3Csvg width='18' height='10' viewBox='0 0 18 10' fill='none' xmlns='http://www.w3.org/2000/svg' data-v-379f2b63=''%3E%3Cpath d='M1 1L9 9L17 1' stroke='black'%3E%3C/path%3E%3C/svg%3E");

    @screen md-down {
      background-size: toRem(9);
      text-indent: toRem(6);
    }
  }

  &__secondary {
    .ratio-container {
      aspect-ratio: 0.7241;
    }
    @screen md-down {
      border-top: 1px solid currentColor;
    }
    .booking-block__left-part,
    .booking-block__right-part {
      @screen md-down {
        padding-left: toRem(28);
        padding-right: toRem(28);
      }
    }
    .booking-block__title {
      @screen md-down {
        margin-bottom: toRem(80);
      }
    }
    .booking-block__item {
      @screen md-down {
        margin-bottom: toRem(54);
      }
    }
  }
}
</style>