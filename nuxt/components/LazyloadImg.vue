<template>
  <!-- THE LAST BREAKPOINT WILL ALWAYS BE MAX-WIDTH -->
  <!-- Example: 
    :widths="[700, 600, 512, 100]"
    :breakpoints="[1200, 1024, 641, 640]">

    @media (min-width: 1200) {
      srcset = 700px 1x, 1400px 2x, 2800px 3x
    }
    @media (min-width: 1024) {
      srcset = 600px 1x, 1200px 2x, 2400px 3x
    }
    @media (min-width: 641) {
      srcset = 512px 1x, 1024px 2x, 2048px 3x
    }
    @media (max-width: 640) { PAY ATTENTION TO THIS
      srcset = 100px 1x, 200x 2x, 300px 3x
    }
  -->
  <picture v-if="src" :class="pictureClasses" :style="pictureStyles">
    <source
      v-for="(width, index) in widths"
      :key="width"
      :data-srcset="
        src +
        '/m/' +
        width +
        'x' +
        ' 1x, ' +
        src +
        '/m/' +
        width * 2 +
        'x' +
        ' 2x, ' +
        src +
        '/m/' +
        width * 3 +
        'x' +
        ' 3x'
      "
      :media="
        index === breakpoints.length - 1
          ? '(max-width:' + breakpoints[index] + 'px)'
          : '(min-width:' + breakpoints[index] + 'px)'
      "
    />
    <img
      v-if="isSVG(src) || !isStoryblokImg(src)"
      :data-src="src"
      :src="src"
      :class="imgClasses"
      class="lazyload"
      :width="width"
      :height="height"
      :alt="alt ? alt : ''"
      :style="imageStyles"
    />
    <img
      v-else
      :data-src="src + '/m/'"
      :src="src + '/m/' + '10' + 'x'"
      :class="imgClasses"
      class="lazyload"
      :width="width"
      :height="height"
      :alt="alt ? alt : ''"
      :style="imageStyles"
    />
  </picture>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
    },
    imgClasses: {
      type: String,
      default: '',
    },
    pictureClasses: {
      type: String,
      default: '',
    },
    widths: {
      type: Array,
      default: () => [],
    },
    breakpoints: {
      type: Array,
      default: () => [],
    },
    absolute: {
      type: Boolean,
      default: false,
    },
    forceRatio: {
      type: Object,
      default: {
        force: false,
        aspectRatio: null
      }
    }
  },
  data() {
    return {
      width: null,
      height: null,
    };
  },
  computed: {
    aspectRatio() {
      if (this.width && this.height && !this.$props.forceRatio.force) {
        return (this.height / this.width) * 100 + '%';
      } else if (this.$props.forceRatio.aspectRatio) {
        return (1 / Number(this.$props.forceRatio.aspectRatio) * 100) + '%';
      } else {
        return null;
      }
    },
    imageStyles() {
      if (this.$props.absolute) {
        return {
          position: 'absolute',
          left: '0',
          top: '0',
          width: '100%',
          height: '100%',
        };
      }
      return {};
    },
    pictureStyles() {
      if (this.$props.absolute) {
        return {
          display: 'block',
          width: '100%',
          position: 'relative',
          paddingTop: this.aspectRatio,
        };
      }
      return {};
    },
  },
  created() {
    const splittedArray = this.src.split('/');
    if (splittedArray.length < 5 || splittedArray[5].split('x').length > 2)
      return;

    let dimensions = {
      width: splittedArray[5].split('x')[0],
      height: splittedArray[5].split('x')[1],
    };

    this.width = dimensions.width;
    this.height = dimensions.height;
  },
  methods: {
    transformImage(image, option, density) {
      if (!image) return '';
      if (!option) return '';
      if (!image.includes('//a.storyblok.com')) return image;
      let imageService = '//img2.storyblok.com/';
      let path = image
        .replace('https://a.storyblok.com', '')
        .replace('//a.storyblok.com', '');
      return imageService + option + path + ' ' + density;
    },
    isSVG(url) {
      return /\.(svg)$/.test(url)
    },
    isStoryblokImg(url) {
      return url.includes('https://a.storyblok.com')
    }
  },
};
/*
Usage in templates.
<lazyload-img
  :widths="[640, 768, 1024, 600, 1000]"
  :breakpoints="[639, 640, 768, 1024, 1200]"
  :key="blok.image.filename"
  :src="blok.image.filename"
  :absolute="true"
  pictureClasses="block foo"
  imgClasses="block foo"
/>
*/
</script>
