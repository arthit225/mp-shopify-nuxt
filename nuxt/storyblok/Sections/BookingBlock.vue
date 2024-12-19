<template>
  <section
    v-editable="blok"
    :data-id="blok._uid"
    :data-component="blok.component"
    :id="blok._uid"
    v-if="blok"
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
              v-if="isImage(blok.media_asset.filename)"
              :widths="[600, 500, 300, 767, 640]"
              :breakpoints="[1400, 1200, 1024, 641, 640]"
              :key="blok.media_asset.filename"
              :src="blok.media_asset.filename"
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
                <source :src="blok.media_asset.filename" />
              </play-pause-video>
            </figure>
          </div>
        </div>

        <div v-else class="max-w-[33.125rem] mx-auto">
          <div class="flex flex-col-reverse -mb-4 relative z-[1] text-center">
            <h2 class="heading-m leading-none">
              {{ blok.heading }}
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
              {{ blok.top_title }}
            </h3>
          </div>

          <div class="booking-block__image-wrapper max-w-[28.125rem] mx-auto">
            <lazyload-img
              v-if="isImage(blok.media_asset.filename)"
              :widths="[600, 500, 300, 767, 640]"
              :breakpoints="[1400, 1200, 1024, 641, 640]"
              :key="blok.media_asset.filename"
              :src="blok.media_asset.filename"
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
                <source :src="blok.media_asset.filename" />
              </play-pause-video>
            </figure>
          </div>

          <div class="text-medium leading-[1.375rem] md:leading-[1.688rem]">
            <p class="mb-6 mt-6">
              {{ blok.description }}
            </p>
            <div class="flex flex-wrap gap-3 justify-center items-center">
              <nuxt-link
                v-if="blok.button_link"
                :to="
                  blok.button_link && blok.button_link.url
                    ? blok.button_link.url
                    : (blok.button_link.cached_url
                        ? '/' + blok.button_link.cached_url
                        : '/') +
                      (blok.button_link.anchor
                        ? '#' + blok.button_link.anchor
                        : '')
                "
                :target="blok.button_link.url ? '_blank' : '_self'"
                class="button--primary-reverse inline-flex"
              >
                {{ blok.button_text }}
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>
      <div
        class="
          booking-block__right-part
          text-center
          mx-auto
          p-16
          lg-down:px-8
          md-down:py-10 md-down:px-4
          w-full
          md:w-1/2
        "
        :class="[blok.secondary_layout ? '' : 'bg-mp-off-white']"
      >
        <div
          class="
            booking-block__content
            text-center
            mx-auto
            h-full
            flex flex-col
            justify-evenly
            items-center
            max-w-[28.75rem] max-auto
          "
        >
          <h4
            class="
              text-xs
              leading-loose
              booking-block__title
              tracking-[2px]
              mb-1
              futura-std-medium
            "
          >
            APPOINTMENTS
          </h4>

          <!-- <div
            class="
              !hidden
              w-full
              flex
              gap-4
              justify-center
              mdate-picker
            ">
            <div class="booking-block__item">
              <button
                @click="revealDatePicker"
                class="p-5 md-down:p-2.5 border-b border-black cursor-pointer mb-2.5 h1 leading-none relative heading-m !italic"
                v-if="showDate == false"
              >
                {{ todaysDate.toLocaleString("default", { month: "long" }) }}
                {{ todaysDate.getFullYear() }}
              </button>
              <input type="date" name="" id="" class="mb-2.5" v-if="showDate" />
            
              <label
                :for="blok._uid"
                class="block md-down:text-xs md-down:leading-[1.5rem]slug-m"
                >DATE</label
              >
            </div>
          </div> -->

          <div class="w-full booking-block__item">
            <select
              class="
                p-5
                md-down:p-2.5
                border-b
                !hidden
                border-black
                heading-m
                cursor-pointer
                mb-2.5
                h1
                leading-none
                relative
                w-auto
              "
              v-model="locationID"
            >
              <option
                v-for="(location, index) in centerData"
                :key="location.id"
                :value="index"
              >
                <i>{{ location.name }}</i>
              </option>
            </select>

            <div
              class="
                relative
                mb-2.5
                border-b border-black
                saol-display-light
                heading-m
                flex
              "
            >
              <button
                type="button"
                class="flex items-center w-full p-5 md-down:p-2.5"
                @click="showDropdown = !showDropdown"
              >
                <span
                  class="cursor-pointer flex-1 relative"
                  ref="dropdownTriggerRef"
                >
                  <i>{{ centerData[locationID].name }}</i>
                </span>
                <IconsDownArrowBold class="absolute right-0 top-1/2" />
              </button>
              <ul
                v-if="showDropdown"
                ref="dropdownRef"
                class="
                  stylized-dropdown
                  text-left
                  px-8
                  absolute
                  bg-white
                  z-[1]
                  border border-black
                "
              >
                <li class="cursor-pointer" @click="showDropdown = false">
                  <span>
                    <i>{{ centerData[locationID].name }}</i>
                  </span>
                </li>
                <li
                  v-for="(location, index) in centerData"
                  :key="location._uid"
                  @click="(locationID = index), (showDropdown = false)"
                  class="cursor-pointer"
                  :class="[locationID == index ? '!hidden' : '']"
                >
                  <i>{{ location.name }}</i>
                </li>
              </ul>
            </div>
            <p class="md-down:text-xs md-down:leading-[1.5rem]">LOCATION</p>
          </div>

          <div
            class="text-center mt-8"
            :class="[blok.secondary_layout ? 'w-full' : '']"
          >
            <nuxt-link
              :to="bookUrl"
              target="_blank"
              class="button--primary inline-flex justify-center uppercase"
              :class="[blok.secondary_layout ? 'md-down:w-full' : '']"
            >
              Check Availability
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const { blok } = defineProps({ blok: Object });
const { isImage } = useUtils();
const locationID = ref(0);
const showDropdown = ref(false);
const centerData = [
  {
    name: "King West",
    id: "402391b9-0b4a-4da1-bd94-f923b152c50b",
    base: "majestyspleasure"
  },
  {
    name: "Yorkville",
    id: "4913e896-8f49-4668-9e1c-d478146d2289",
    base: "majestyspleasure"
  },
  {
    name: "Flatiron",
    id: "f5a60c3e-bd44-494d-a08a-2268ed01df62",
    base: "majestysusa"
  }  
];
const bookUrl = computed(
  () =>
    `https://${centerData[locationID.value].base}.zenoti.com/webstoreNew/services/${centerData[locationID.value].id}`
);

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
  span {
    svg {
      width: 100%;
      height: 100%;
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
  .mdate-picker {
    @screen md-down {
      border: toRem(1) solid;
      paddding: toRem(10);
      border-radius: toRem(12);
    }
  }
  .stylized-dropdown {
    box-shadow: 0 0 20px rgb(0 0 0 / 20%);
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 2.5rem;
    left: 0;
    max-height: 50vh;
    max-width: 100%;
    overflow: auto;
    padding: 1rem;
    position: absolute;
    text-transform: capitalize;
    top: 50%;
    width: 100%;

    li {
      line-height: 1.2;
      overflow: hidden;
      position: relative;
      &::after {
        background: var(--mp-coral);
        bottom: 0.1em;
        content: "";
        display: block;
        height: 45%;
        left: 0;
        opacity: 0;
        position: absolute;
        transition: opacity 0.2s ease-out;
        width: 100%;
        z-index: -1;
      }

      &:hover {
        &::after {
          opacity: 0.6;
        }
      }
    }
  }
}
</style>
