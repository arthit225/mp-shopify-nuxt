<template>
  <article
    v-if="blok"
    v-editable="blok"
    :data-id="blok._uid"
    :data-component="blok.component"
    :id="blok._uid"
    :data-arrangment="blok.arrangement"
    class="music-playlist-grid my-4 md:my-8 lg:my-16 px-4 md:px-8 lg:px-16"
  >
    <header
      class="
        music-playlist-grid__header
        text-center
        heading-m
        py-5
        md:py-10
        lg:py-20
      "
    >
      <h2 v-if="blok.title">{{ blok.title }}</h2>
    </header>
    <section
      class="music-playlist-grid__grid"
      :class="
        blok.arrangement == 'two_up'
          ? 'music-playlist-grid__grid-two-up grid sm:grid-cols-2 sm:gap-y-4 md:gap-y-8 lg:gap-y-12 gap-x-4 md:gap-x-8 lg:gap-x-16'
          : 'music-playlist-grid__grid-one-up'
      "
    >
      <div
        v-for="item in items"
        :key="item._uid"
        :id="item._uid"
        class="music-playlist-grid__item relative md-down:!mb-20"
        @click="item.spotify_embed ? toggleSpotify(item) : ''"
      >
        <figure 
          class="music-playlist-grid__fig flex items-center relative md-down:mb-6"
          :class="[item.spotify_embed ? 'cursor-pointer' : '']"
        >
          <lazyload-img
            v-if="isImage(item.asset.filename)"
            :widths="[700, 600, 641, 640]"
            :breakpoints="[1200, 1024, 641, 640]"
            :key="item.asset.filename"
            :src="item.asset.filename"
            pictureClasses="block w-full "
            imgClasses="block object-cover"
            :class="[item.spotify_embed && activePlaylist === item ? 'opacity-0' : '']"
          />
          <span 
            v-if="item.spotify_embed && activePlaylist !== item" 
            class="
              music-playlist-grid__play-svg 
              absolute 
              top-1/2 
              left-1/2 
              -translate-x-1/2 
              -translate-y-1/2
              w-[4.875rem] h-[4.875rem]
              md:w-[6.5rem] md:h-[6.5rem]
            "
          >
            <icons-play class="w-full h-full"/>
          </span>
          <div v-if="activePlaylist === item" class="music-playlist-grid__iframe absolute bottom-0 h-full w-full" v-html="item.spotify_embed">
          </div>
        </figure>
        <div class="music-playlist-grid__item-text flex">
          <div>
            <div
              v-if="item.location"
              class="
                text-xs
                uppercase
                inline-block
                music-playlist-grid__location
                mb-4
                relative
                mid-underline
                music-font
                ml-1
              "
            >
              {{ item.location }}
            </div>
            <h3 v-if="item.title" class="heading-m md:whitespace-pre-line mb-3">
              {{ item.title }}
            </h3>
            <div v-if="item.description" class="md:whitespace-pre-line">
              {{ item.description }}
            </div>
            <nuxt-link to="/" class="text-xs underline inline-block mt-8" v-if="blok.arrangement !== 'two_up'">
              SHARE
            </nuxt-link>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <ul 
        v-if="pageCount > 1" 
        class="music-playlist-grid__pagination col-span-full flex flex-wrap items-center justify-center">
        <li v-for="page in pageCount" :key="page">
          <button 
            class="px-2.5 mx-2.5 tracking-[2px]"
            :class="[currentPage === page ? 'active' : '']" 
            :aria-label="`Page ${page}`"
            @click="filterItems(page)"
          >
            <span
              class="
                uppercase
                inline-block
                mb-4
                relative
                mid-underline
                music-font
                " 
            >
              <span v-if="page < 9">0</span>{{ page }}
            </span>
          </button>
        </li>

        <li>
          <button 
            class="px-2.5 mx-2.5 tracking-[2px]" 
            aria-label="Next Page"
            @click="filterItems((currentPage + 1) <= pageCount ? (currentPage + 1) : pageCount)">
            <span 
              class="
                uppercase
                inline-block
                mb-4
                relative
                mid-underline
                music-font
                "
            >
              NEXT
            </span>
          </button>
        </li>
        <li>
          <button 
            class="px-2.5 mx-2.5 tracking-[2px]" 
            aria-label="Last Page"
            @click="filterItems(pageCount)"
          >
            <span 
              class="
                uppercase
                inline-block
                mb-4
                relative
                mid-underline
                music-font
                "
            >
              LAST
            </span>
          </button>
        </li>
      </ul>
    </section>
  </article>
</template>


<script setup>
  const { isImage } = useUtils();
  const { blok } = defineProps({
    blok: Object,
  });
  const activePlaylist = ref(null);

  const limit = ref(blok.arrangement === 'two_up' ? 6 : 3);
  const items = ref(blok.playlist_items);
  const pageCount = ref(Math.ceil(items.value.length/limit.value))
  const currentPage = ref(1)

  function filterItems(page) {
    activePlaylist.value = null
    items.value = blok.playlist_items
    items.value = items.value.slice((page -1)*limit.value, limit.value * page)
    currentPage.value = page
  }

  onMounted(() => {
    filterItems(currentPage.value)
  })

  function toggleSpotify(item) {
    if (!item.spotify_embed) {
      return;
    }
    activePlaylist.value = item;
  }
</script>



<style lang="scss">
.music-font {
  letter-spacing: toRem(2);
  font-family: 'Futura Std';
  font-weight: 500;
}
.music-playlist-grid {
  &__iframe {
    iframe {
      height: 100%;
      width: 100%;
    }
  }
  &__item {
    margin-bottom: 1rem;
    @screen md {
      display: flex;
    }
  }

  &__item-text {
  }

  &__grid-one-up {
    .music-playlist-grid__item {
      margin-bottom: 1rem;
      @screen md-down {
        figure {
          margin-left: -1rem;
          margin-right: toRem(55);
        }
        .music-playlist-grid__item-text {
          text-align: right;
          padding: 0 toRem(6);
          justify-content: right;
        }
      }

      &:nth-child(even) {
        flex-direction: row-reverse;
        @screen md-down {
          figure {
            margin-right: -1rem;
            margin-left: toRem(55);
          }
          .music-playlist-grid__item-text {
            text-align: left;
            padding: 0 toRem(6);
            justify-content: left;
          }
        }
      }

      @screen md {
        margin-bottom: 2rem;
        figure {
          flex: 1 1 66.6666667%;
        }
        &-text {
          flex:1 1 33.3333333%;
        }
      }

      @screen lg {
        margin-bottom: 4rem;
      }
    }

    .music-playlist-grid__item-text {
      align-items: center;
      padding: 0 4rem;
    }
  }

  &__grid-two-up {
    .music-playlist-grid__fig {
      margin-bottom: toRem(24);
    }
    .music-playlist-grid__item {
      margin-bottom: 1rem;
      @screen md {
        flex-direction: column;
      }
    }
    .music-playlist-grid__fig {
    }
    .music-playlist-grid__item-text {
    }
  }

  &__pagination {
    button {
      .mid-underline {
        &::before {
          opacity: 0;
          transition: opacity 0.3s ease-in-out;
        }
      }
      &.active {
        .mid-underline {
          &::before {
            opacity: 0.6;
          }
        }
      }
      @screen md {
        &:hover {
          .mid-underline {
            &::before {
              opacity: 0.6;
            }
          }
        }
      }
    }
  }
}
picture {
  img {
    margin: 0 auto;
  }
}
</style>
