<template>
  <section
    v-if="blok"
    v-editable="blok"
    :data-id="blok._uid"
    :data-component="blok.component"
    :id="blok._uid"
    class="booking-block pt-20"
  >

    <div class="flex futura-std-regular text-center flex-col md:flex-row">
      <div
        class="booking-block__left-part flex items-center p-16 lg-down:px-8 md-down:py-10 md-down:px-4 w-full md:w-1/2 text-white bg-black"
      >

        <div class="max-w-[33.125rem] mx-auto">
          <div class="flex flex-col-reverse -mb-4 relative z-[1] text-center">
            <h2
              v-if="blok.heading"
              class="heading-m leading-none"
            >
              {{ blok.heading }}
            </h2>
            <h3
              v-if="blok.top_title"
              class="text-xs leading-loose tracking-[2px] mb-1 futura-std-medium"
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
              figureClasses="block w-full mb-8"
              pictureClasses="w-full block"
              imgClasses="w-full block"
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
                :class="'w-full block'"
              >
                <source :src="blok.media_asset.filename" />
              </play-pause-video>
            </figure>
          </div>

          <div class="text-medium leading-[1.375rem] md:leading-[1.688rem]">
            <p
              v-if="blok.description"
              class="mb-6 mt-6"
            >
              {{ blok.description }}
            </p>
            <div class="flex flex-wrap gap-3 justify-center items-center">
              <nuxt-link
                v-if="blok.button_link"
                :to="blok.button_link && blok.button_link.url ? blok.button_link.url : (blok.button_link.cached_url ? '/' + blok.button_link.cached_url : '/') + (blok.button_link.anchor ? '#' + blok.button_link.anchor : '')"
                :target="blok.button_link.url ? '_blank' : '_self'"
                class="button--primary-reverse inline-flex"
              >
                {{ blok.button_text }}
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>
      <div class="
          booking-block__right-part
          mx-auto
          p-8
          lg-down:px-8
          md-down:py-10
          md-down:px-4
          w-full
          md:w-1/2
          bg-mp-off-white
        ">
        <div class="booking-block__content mx-auto h-full flex flex-col justify-evenly max-auto text-left">
          <h2 class="text-xs leading-loose booking-block__title tracking-[2px] mb-1 futura-std-medium text-center">
            {{ blok.top_right_title ? blok.top_right_title :'DRINK MENU' }}
          </h2>
          <div
            class="grid"
            :class="[(rightColumn && rightColumn.length > 0) && (leftColumn && leftColumn.length > 0) ? 'lg:grid-cols-2': '']"
          >
            <div
              class="md:px-8"
              :class="[rightColumn && rightColumn.length > 0 ? 'lg:border-r lg:border-black': '']"
            >
              <div
                v-for="menu in leftColumn"
                :key="menu._uid"
                class="mb-4"
              >
                <h3 class="heading-sm leading-[1.3] saol-display-regular mb-5">{{ menu.name }}</h3>
                <ul
                  v-if="menu.sub_menus.length > 0"
                  class="slug-xs leading-loose"
                >
                  <template
                    v-for="subMenu in menu.sub_menus"
                    :key="subMenu._uid"
                  >
                    <li
                      v-if="subMenu?.drink_name && subMenu?.drink_price"
                      class="flex justify-between mb-4"
                    >
                      <span>{{ subMenu.drink_name }}</span>
                      <span>{{ subMenu.drink_price }}</span>
                    </li>
                    <template v-else-if="menu.use_nested_sub_menus">
                      <li
                        v-if="subMenu?.name && subMenu?.drink_item_list?.length > 0"
                      >
                        <h4 class="font-bold slug-xs mb-2 mt-5">{{ subMenu?.name }}</h4>
                        <ul
                          v-if="subMenu?.drink_item_list?.length > 0"
                          class="slug-xs leading-loose"
                        >
                          <li
                            v-for="drinkItem in subMenu.drink_item_list"
                            :key="drinkItem._uid"
                            class="flex justify-between mb-4"
                          >
                            <span>{{ drinkItem.drink_name }}</span>
                            <span>{{ drinkItem.drink_price }}</span>
                          </li>
                        </ul>
                      </li>
                    </template>
                  </template>
                </ul>
              </div>
            </div>

            <div
              class="md:px-8"
              :class="[leftColumn && leftColumn.length > 0 ? 'lg:border-l lg:border-transparent': '']"
            >
              <div
                v-for="menu in rightColumn"
                :key="menu._uid"
                class="mb-4"
              >
                <h3 class="heading-sm leading-[1.3] saol-display-regular mb-5">{{ menu.name }}</h3>
                <template v-if="menu.use_nested_sub_menus">
                  <div
                    v-for="subMenu in menu.sub_menus"
                    :key="subMenu._uid"
                  >
                    <h4 class="font-bold slug-xs mb-2 mt-5">{{ subMenu.name }}</h4>
                    <ul
                      v-if="subMenu.drink_item_list.length > 0"
                      class="slug-xs leading-loose"
                    >
                      <li
                        v-for="drinkItem in subMenu.drink_item_list"
                        :key="drinkItem._uid"
                        class="flex justify-between mb-4"
                      >
                        <span>{{ drinkItem.drink_name }}</span>
                        <span>{{ drinkItem.drink_price }}</span>
                      </li>
                    </ul>
                  </div>
                </template>
                <ul
                  v-else-if="menu.sub_menus.length > 0"
                  class="slug-xs leading-loose"
                >
                  <li
                    v-for="subMenu in menu.sub_menus"
                    :key="subMenu._uid"
                    class="flex justify-between mb-4"
                  >
                    <span>{{ subMenu.drink_name }}</span>
                    <span>{{ subMenu.drink_price }}</span>
                  </li>
                </ul>
              </div>
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
console.log(blok)
const leftColumn = ref(blok.left_column);
const rightColumn = ref(blok.right_column);
</script>