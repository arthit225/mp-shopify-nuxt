<template>
  <section
    v-if="blok"
    class="
      membership-packages
      px-4 md:px-16 py-16 md:pt-20 md:pb-32
      border-b
      border-t
      border-mp-gray
    "
    v-editable="blok"
    :data-id="blok._uid"
    :data-component="blok.component"
    :id="blok._uid"
  >
    <div
      class="
        membership-packages__container
        max-w-[69.25rem]
        mx-auto
        futura-std-medium
      "
    >
      <header v-if="blok.heading" class="">
        <h2
          class="
            heading-xl
            text-center
            leading-[82%]
            mb-7 md:mb-[92px]
          "
        >
          {{ blok.heading }}
        </h2>
      </header>
      <nav v-if="blok.packages.length > 0" class="my-10 md:mb-20">
        <button
          class="membership-packages__mobile-btn md:hidden"
          :class="[isExpanded ? 'opened' : '']"
          aria-label="Open Pakcage Type Dropdown"
          @click="toggleMenu()"
        >
          {{ selectedTitle }}
          <span>
            <IconsDownArrow />
          </span>
        </button>
        <ul
          class="md:hidden"
          v-show="isExpanded"
          role="tablist"
        >
          <li
            v-for="(membership_package) in blok.packages"
            :key="membership_package.title"
            :id="`tab-${convertToSlug(membership_package.title)}`"
            role="tab"
            :aria-controls="`panel-${convertToSlug(membership_package.title)}`"
            :aria-selected="selectedTitle === membership_package.title ? true : false"
            class="membership-packages__menu-item md-down:text-center"
            :class="[
              selectedTitle === membership_package.title
                ? 'selected md-down:hidden'
                : 'md-down:flex',
            ]"
            @click="openTab(membership_package.title)"
          >
            <u>{{ membership_package.title }}</u>
          </li>
        </ul>
      </nav>
      <div class="flex gap-x-20 membership-packages-row">
        <div
          v-for="(membership_package, i) in blok.packages"
          :key="i"
          :id="`panel-${convertToSlug(membership_package.title)}`"
          v-show="!isMobile || (selectedTitle === membership_package.title)"
          class="membership-packages__description flex-1 md:block"
          :class="[
            selectedTitle === membership_package.title
              ? 'active'
              : '',
          ]"
        >
          <h3
            class="text-lg font-medium leading-[1.5rem] mb-2 md:mb-4"
          >
            {{ membership_package.title }}
          </h3>
          <div> {{ membership_package.price }} </div>
          <div class="grid gap-y-20 md:gap-y-[3.375rem] mt-[3.5rem]">
            <div
              v-for="feature in membership_package.features"
              :key="feature.name"
              class="membership-packages__content-bock"
            >
              <div>
                <div class="uppercase flex justify-between tracking-[0.125rem]">
                  <h4
                    class="text-lg font-medium leading-[1.5rem] mb-2 md:mb-4"
                    v-if="feature.name"
                  >
                    {{ feature.name }}
                  </h4>
                </div>
                <div
                  v-if="feature.description"
                  class="futura-std-regular text-lg leading-[150%]"
                >
                  {{ feature.description }}
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="membership_package.button_text && membership_package.button_link !=undefined"
          >
            <nuxt-link
              :to="membership_package.button_link.url ? membership_package.button_link.url : (membership_package.button_link ? '/'+membership_package.button_link.cached_url : '/') + (membership_package.button_link.anchor ? '#' + membership_package.button_link.anchor : '')"
              class="button--primary block  w-full text-center mt-12"
            >
              {{ membership_package.button_text }}
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const { blok } = defineProps({ blok: Object });
const selectedTitle = ref(blok.packages[0]?.title);
const isExpanded = ref(false);
const isMobile = ref(false);
const checkIfMobile = () => {
  console.log('checkIfMobile', window.innerWidth)
  const width =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  if (width < 769) {
    isMobile.value = true;
  } else {
    isMobile.value = false;
  }
};
onMounted(() => {
  checkIfMobile()
  window.addEventListener('resize', checkIfMobile)
})

function convertToSlug(string) {
  return string.toLowerCase().replace(/ /g,'-').replace(/[-]+/g, '-').replace(/[^\w-]+/g,'');
}

function openTab(title) {
  console.log('openTab', title)
  selectedTitle.value = title;
  isExpanded.value = false;
}

function toggleMenu() {
  console.log('toggleMenu', isExpanded.value)
  isExpanded.value = !isExpanded.value;
}
</script>

<style lang="scss" scoped>
.membership-packages {
  ul {
    border: 1px solid currentColor;
    border-top: transparent;
  }
  &__mobile-btn {
    @screen md-down {
      display: flex;
      letter-spacing: toRem(2);
      width: 100%;
      justify-content: center;
      padding: toRem(8);
      padding-right: toRem(40);
      padding-left: toRem(40);
      position: relative;
      align-items: center;
      font-size: toRem(12);
      line-height: 1.25;
      height: toRem(50);
      border: 1px solid currentColor;
      span {
        position: absolute;
        right: toRem(20);
        top: 50%;
        transform: translateY(-50%);
      }
      &.opened {
        border-bottom: transparent;
        span {
          transform: translateY(-50%) rotate(180deg);
        }
      }
    }
  }
  &__menu-item {
    line-height: 1.5;
    letter-spacing: toRem(2);
    cursor: pointer;
    @screen md-down {
      justify-content: center;
      align-items: center;
      font-size: toRem(12);
      line-height: 1.25;
      height: toRem(50);
      padding: toRem(8);
      padding-right: toRem(40);
      padding-left: toRem(40);
    }
    &:hover {
      u, button {
        &::after {
          opacity: .4;
        }
      }
    }
    u, button {
      position: relative;
      text-decoration: none !important;
      @screen md {
        padding: 0 toRem(8);
        &::after {
          background: var(--mp-coral);
          bottom: 0;
          content: "";
          display: block;
          height: 60%;
          left: 0;
          opacity: 0.6;
          position: absolute;
          width: 100%;
          z-index: -1;
          opacity: 0;
          transition: opacity ease .3s;
        }
      }
    }
    &.selected {
      u, button {
        &::after {
          opacity: .6;
        }
      }
    }
  }

  &__content-bock {
    @screen md {
      max-width: toRem(420);
      margin: 0;
      &:nth-child(even) {
        margin-left: auto;
      }
    }
  }
}
</style>
