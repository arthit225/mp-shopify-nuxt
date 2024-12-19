<template>
  <section
    v-if="blok"
    class="location-services px-4 md:px-16 py-16 md:pt-20 md:pb-32"
    v-editable="blok"
    :data-id="blok._uid"
    :data-component="blok.component"
    :id="blok._uid"
  >
    <div
      class="
        location-services__container
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

       <nav v-if="blok.service_types.length > 0" class="mb-10 md:mb-20">
        <button
          class="location-services__mobile-btn md:hidden"
          :class="[isExpanded ? 'opened' : '']"
          aria-label="Open Service Type Dropdown"
          @click="toggleMenu()"
        >
          {{ selectedTitle }}
          <span>
            <IconsDownArrow />
          </span>
        </button>
        <ul
          class="md:flex md:flex-wrap justify-center items-center gap-12"
          v-show="isExpanded"
          role="tablist"
        >
          <li
            v-for="(type) in blok.service_types"
            :key="type.title"
            :id="`tab-${convertToSlug(type.title)}`"
            role="tab"
            :aria-controls="`panel-${convertToSlug(type.title)}`"
            :aria-selected="selectedTitle === type.title ? true : false"
            class="location-services__menu-item md-down:text-center"
            :class="[
              selectedTitle === type.title
                ? 'selected md-down:hidden'
                : 'md-down:flex',
            ]"
            @click="openTab(type.title)"
          >
            <u>{{ type.title }}</u>
          </li>
        </ul>
      </nav>
      <div
        v-for="(block, i) in blok.service_types"
        :key="i"
        :id="`panel-${convertToSlug(block.title)}`"
        role="tabpanel"
        :aria-labelledby="`tab-${convertToSlug(block.title)}`"
        v-show="selectedTitle === block.title"
        class="location-services__description"
        :class="[
          selectedTitle === block.title
            ? 'active'
            : '',
        ]"
      >
        <div class="grid md:grid-cols-2 gap-x-8 gap-y-10 md:gap-y-[4.375rem]">
          <div
            v-for="itemContent in block.service_type_content_block"
            :key="itemContent.name"
            class="location-services__content-bock"
          >
            <div>
              <div class="uppercase flex justify-between tracking-[0.125rem]">
                <h3
                  class="text-medium leading-[1.5rem] mb-2 md:mb-4"
                  v-if="itemContent.name"
                >
                  {{ itemContent.name }}
                </h3>
                <div class="text-xs leading-[2] pl-2" v-if="itemContent.cost">
                  {{ itemContent.cost }}
                </div>
              </div>
              <div
                v-if="itemContent.description"
                class="futura-std-regular text-medium leading-[150%]"
              >
                {{ itemContent.description }}
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
const selectedTitle = ref(blok.service_types[0]?.title);
const isExpanded = ref(false);

onMounted(() => {
  console.log(blok)
})

function convertToSlug(string) {
  return string.toLowerCase().replace(/ /g,'-').replace(/[-]+/g, '-').replace(/[^\w-]+/g,'');
}

function openTab(title) {
  selectedTitle.value = title;
  isExpanded.value = false;
}

function toggleMenu() {
  isExpanded.value = !isExpanded.value;
}
</script>

<style lang="scss">
.location-services {
  ul {
    border: 1px solid currentColor;
    border-top: transparent;
    @screen md {
      border: transparent;
      display: flex !important;
    }
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