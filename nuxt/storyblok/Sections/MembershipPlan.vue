<template>
  <section
    v-if="blok"
    class="membership-two-up-hero"
    ref="root"  
    v-editable="blok"
    :data-id="blok._uid"
    :data-component="blok.component"
    :id="blok._uid"
  >
    <div
      class="
				grid md:grid-cols-2
      "
    >
      <header
        v-if="blok.mobile_stack_order == true"
        class="md:hidden -mb-4 relative z-[1] text-center order-first
				!border !border-black
				">
        <h2
          v-if="blok.title"
          class="
            heading-xl
            tracking-tighter
            whitespace-pre-line !not-italic !leading-[0.6] 
            mb-3
          "
        >
          {{ blok.title }}
        </h2>      
        <h3
          v-if="blok.price"
          class="
            heading-sm
            mb-4
            !tracking-widest
            font-bold
            uppercase
          "
        >
          {{ blok.price }}
        </h3>
      </header>
      <div
        class="
					two-up-hero__img-wrapper
					w-full
				"
        :class="[blok.media_position == 'right' ? 'md:order-1' : '', blok.media_position_mobile == 'bottom' ? 'order-1' : '']"
      >
        <lazyload-img
          v-if="isImage(blok.media_asset.filename)"
          :widths="[900, 700, 600, 512, 640]"
          :breakpoints="[1400, 1200, 1024, 641, 640]"
          :key="blok.media_asset.filename"
          :src="blok.media_asset.filename"
          figureClasses="ratio-container block max-w-full"
          pictureClasses="w-full h-full block"
          imgClasses="block object-cover h-full w-full"
          :aspectRatio="0.8"
        />

        <figure 
          v-else
          class="ratio-container ratio-container__video block max-w-full relative overflow-hidden"
        >
          <play-pause-video
            :preload="true"
            :autoplay="true"
            :muted="true"
            :playsinline="true"
            :loop="true"
            :class="'w-full h-full object-cover absolute top-0 left-0'"
          >
            <source :src="blok.media_asset.filename">
          </play-pause-video>
        </figure>
      </div>
      <div
        class="
          membership-two-up-hero__content
          text-center
          mx-auto
          py-14 px-4
					w-full	
					flex flex-col justify-center				
				">
        <header
          class=""
        >
          <h2
            v-if="blok.title"
            class="
              heading-l
              saol-display-light
              tracking-tighter
              whitespace-pre-line 
              !leading-[0.6] 
              mb-3
            "
          >
            {{ blok.title }}
          </h2>        
          <h3
            v-if="blok.price"
            class="
              notch-button
              my-8
              text-white
              uppercase
              bg-black
              px-6 py-2
              w-fit
              mx-auto
            "
          >
            {{ blok.price }}
          </h3>
        </header>
        <div
          class="
            font-medium
          "
        >
          <p
						v-if="blok.description"
						class="mt-6 mb-6 text-[1.15rem] membership-two-up-hero__desc">
            {{ blok.description }}
          </p>

          <div
            class="
							uppercase
							flex
							justify-center
							items-center
							gap-4
							flex-wrap
							my-8
							mx-auto
						"
            :class="blok.features.length > 3 ? 'max-w-[640px]' : ''"
          >
            <div 
              v-for="(feature, index) in blok.features"
              :key="index"
              class="
                w-[300px]
								h-[200px] 
                whitespace-pre-line
                bg-mp-gray-2
                notch
                relative
              ">
              <div
								class="
									feature-text
									notch--inner
									absolute
									inset-px
									flex
									items-center
									justify-center
									text-xl
                  p-4
								">
                {{ feature.text }}
              </div>
            </div>
          </div>
          <div class="flex flex-wrap -m-2 justify-center items-center"
          :class="[blok.media_position_mobile == 'bottom' ? 'mb-10' : '']"
          >
            <div v-for="item in blok.links" :key="item._uuid" class="m-2">
              <nuxt-link
                v-if="item.button_link"
                :to="item.button_link.url ? item.button_link.url :(item.button_link.cached_url ? '/'+item.button_link.cached_url : '/') + (item.button_link.anchor ? '#' + item.button_link.anchor : '')"
                :target="item.button_link.url ? '_blank' : '_self'"
                class="button--black uppercase inline-flex justify-center !px-10 !py-4 items-center "
              >
                {{ item.button_text }}
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
const { isImage, isVideo } = useUtils();
const root = ref()

onMounted(() => {
  root.value.style.setProperty('--bg-color', blok.background_color.color);
})
</script>

<style lang="scss" scoped>
:root {
  --bg-color: white;
}
.ratio-container {
  &__video {
    aspect-ratio: 0.8;
    padding-top: 125%;
  }
}
.membership-two-up-hero {
  background-color: var(--bg-color);
	&__desc {
		max-width: 300px;
		margin: 0 auto;
	}
	.heading-l {
		@screen md-down {
			font-size: 4rem
		}
	}
  .feature-text {
    background-color: var(--bg-color);
  }
  .button--primary {
    line-height: 1;
    /* color: black;
    / border-color: black;*/
    @screen md-down {
      padding-left: 1.5rem;
      padding-right: 1.5rem;
      min-width: 8.813rem;
    }
  }
  .saol-display-light {
    font-family: 'Saol Display Light' !important;
  }
}
</style>