<template>
  <section
    class="membership-hero"
    :class="[blok.enable_bottom_margin ? 'hero-enable-bottom-margin' : '']"
    v-editable="blok"
    :data-id="blok._uid"
    :data-component="blok.component"
    :id="blok._uid"
    v-if="blok"
  >
    <div 
    class="relative flex h-[500px] justify-center"
    >
      <figure class="absolute left-0 top-0 w-full h-full z-[-1]">
        <lazyload-img
          v-if="isImage(blok.bg_image.filename)"
          :widths="[1400, 1200, 1024, 640]"
          :breakpoints="[1200, 1024, 641, 640]"
          :key="blok.bg_image.filename"
          :src="blok.bg_image.filename"
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
          <source :src="blok.bg_image.filename">
        </play-pause-video>
      </figure>
      <header
        class="hero__caption flex flex-col justify-center items-center text-center"
      >

				<figure class="hero__membership-logo">
					<icons-logo-inline-written/>
				</figure>

        <h2
          v-if="blok.title"
          class="						
						tracking-tighter
            whitespace-pre-line
						!not-italic
						!leading-[0.6] 
            mb-1.5 lg:mb-2.5
						max-w-[650px]
						text-white
						membership-hero__title
					"
          :class="{'text-black' : !blok.bg_image.filename}">
          {{ blok.title }}
        </h2>
      </header>
    </div>
  </section>
</template>

<script setup>


const { blok } = defineProps({ blok: Object });
const { isImage } = useUtils();
onMounted(() => {
  console.log("blokky", blok);
});

</script>

<style lang="scss" scoped>
.hero-enable-bottom-margin {
  margin-bottom: toRem(60);
  @screen md {
      margin-bottom: toRem(120);
  }
}
.hero {
	&__membership-logo {
		svg {
			path {
				fill: white;
			}
		}
	}
}

</style>

<style lang="scss">
.membership-hero {
	&__title {
		font-size: 27vw;
		@screen sm {
			font-size:6.25rem;
		}
	}
}
.hero__membership-logo {
	margin: 0 auto 2rem auto;
	max-width: 280px;
	@screen sm {
		max-width: 300px;
	}
}
.hero__membership-logo svg {
	width: 100%;
	height: 100%;
}
.hero__membership-logo svg path {
	fill: white;
}
.hero__membership-logo.hero__membership-logo--black {
		svg path {
			fill: black;
		}
	}
</style>

