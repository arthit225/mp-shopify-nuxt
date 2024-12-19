<template>
  <section
    ref="notSureWhyRef"
    class="
      not-sure-where-to-do
      px-4
      md:pl-8
      md:pr-4
      mt-24
      mb-32
      md:my-24
      max-w-full
    "
    v-if="blok"
    v-editable="blok"
    :data-id="blok._uid"
    :data-component="blok.component"
    :id="blok._uid"
  >
    <div class="flex gap-x-[5.85%]">
      <figure class="w-[36.9%] hidden md:block relative">
        <lazyload-img
          :widths="[700, 600, 512, 100]"
          :breakpoints="[1200, 1024, 641, 640]"
          :key="featuredImage.filename"
          :src="featuredImage.filename"
          :pictureClasses="'w-full block'"
          :imgClasses="'w-full h-full object-cover absolute top-0  left-0 lazyload blur-up'"
        />
      </figure>
      <article
        class="w-full md:w-[63.1%] flex flex-col justify-center items-start overflow-x-hidden"
        :style="{
          color: blok.text_color ? blok.text_color.color : '#000000',
        }"
      >
        <div
          v-if="blok.small_heading"
          class="futura-std-medium text-extra-small leading-[2] tracking-[2px] mb-5 sm:mb-[1.875rem]"
        >
          {{ blok.small_heading }}
        </div>
        <div
          class="
          saol-display-light
          text-[9vw]
          md:text-[5vw]
          leading-[1.05]
          mb-10"
        >
          <p>
            I am
            <span>
              <span
                class="
                  relative
                  lookingForQuestion
                  text-ellipsis
                  whitespace-nowrap
                  pr-8"
                >
                <span class="lookingForText cursor-pointer relative" ref="dropdownTriggerRef">
                  <i>{{lookingForQuestion.title}}</i>
                </span>
                <IconsDownArrowBold
                  class="absolute top-1/2 right-0"
                />
                <ul ref="dropdownRef" class="stylized-dropdown stylized-dropdown--first !hidden text-left px-8 absolute bg-white z-[1] border border-black">
                  <li class="relative">
                    <i>
                      {{lookingForQuestion.title}}
                    </i>
                    <!-- <IconsDownArrowBold
                      class="absolute top-1/2 right-0"
                    /> -->
                  </li>
                  <li
                    v-for="(question, index) in notSureWhereToStartData.Items"
                    :key="question._uid"
                    :data-value="index"
                    @click="questionID = index, answerID=0"
                    class="question"
                    :class="[questionID == index ? '!hidden' : '']"
                  >
                    <i>{{question.title}}</i>
                  </li>
                </ul>
              </span>
            </span>
          </p>
          <p> and looking for a </p>
          <p>
            <span class="
              relative
              lookingForAnswer
              overflow-hidden
              text-ellipsis
              whitespace-nowrap
              pr-8
            ">
              <span
                class="
                lookingForText
                cursor-pointer
                relative
                "
                ref="dropdownTriggerRef"
              >
                <i>{{lookingForAnswer.text}}</i>
              </span>
              <IconsDownArrowBold
                class="absolute top-1/2 right-0"
              />
              <ul ref="dropdownRef" class="stylized-dropdown !hidden text-left px-8 absolute bg-white z-[1] border border-black">
                <li class="relative">
                  <i>
                    {{lookingForAnswer.text}}
                  </i>
                  <!-- <IconsDownArrowBold
                    class="absolute top-1/2 right-0"
                  /> -->
                </li>
                <li
                v-for="(answer, index) in lookingForQuestion.answers"
                  :key="answer._uid"
                  :data-value="index"
                  @click="answerID = index"
                  class="question"
                  :class="[answerID == index ? '!hidden' : '']"
                >
                  <i>{{answer.text}}</i>
                </li>
              </ul>
            </span>
          </p>
        </div>
        <!--div
          v-if="blok.text"
          v-html="richText(blok.text)"
          class="saol-display-light heading-l leading-[1.05] mb-10"
        ></div-->
        <div v-if="blok.button_text" class="flex">
          <nuxt-link
            :to="lookingForAnswer.url.url ? lookingForAnswer.url.url :(lookingForAnswer.url.cached_url ? '/'+lookingForAnswer.url.cached_url : '/') + (lookingForAnswer.url.anchor ? '#' + lookingForAnswer.url.anchor : '')"
            :target="lookingForAnswer.url.linktype==='story' ?'_self':'_blank'"
            class="button--primary"
            :style="{
              color: blok.text_color ? blok.text_color.color : '#000000',
              borderColor: blok.text_color ? blok.text_color.color : '#000000',
            }"
          >
            {{ blok.button_text }}
          </nuxt-link>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
const { blok } = defineProps({ blok: Object });
const { richText } = useUtils();
const questionID = ref(0)
const notSureWhereToStartData = inject("notSureWhereToStartData");
const lookingForQuestion = computed(()=> notSureWhereToStartData.Items[questionID.value])
const answerID = ref(0)
const lookingForAnswer = computed(()=>lookingForQuestion.value.answers[answerID.value])
let prevFeaturedImage = blok.image
const featuredImage = computed(()=> lookingForAnswer.value.asset?.filename ? lookingForAnswer.value.asset : prevFeaturedImage)
const notSureWhyRef = ref(null);

onMounted(() => {
  // console.log('blokky', blok)
  const stylizedDropdown = notSureWhyRef.value.querySelectorAll('.stylized-dropdown')
  notSureWhyRef.value.querySelectorAll('.lookingForText').forEach((e, index) => {
    e.addEventListener('click', (ee) => {
      if (stylizedDropdown[index].classList.contains('!hidden')) {
        stylizedDropdown[index].classList.remove('!hidden')
      } else {
        stylizedDropdown[index].classList.add('!hidden')
      }
    })
  })
  notSureWhyRef.value.querySelectorAll('li').forEach((e) => {
    e.addEventListener('click', (item) => {
      e.closest('.stylized-dropdown').classList.add('!hidden');
    })
  })
});

onUpdated(() => {
  notSureWhyRef.value.querySelectorAll('li').forEach((e) => {
    e.addEventListener('click', (item) => {
      e.closest('.stylized-dropdown').classList.add('!hidden');
      prevFeaturedImage = featuredImage.value
    })
  })
})
</script>

<style lang="scss" scoped>
picture {
  display: block;
  padding-top: 130%;
}
.not-sure-where-to-do {
  .lookingForText {
    &::after {
      content: "";
      z-index: -1;
      opacity: 0.60;
      width: 100%;
      height: 45%;
      display: block;
      position: absolute;
      left:0;
      bottom:0;
      background: var(--mp-coral);
    }
  }
  .lookingForAnswer {
    max-width: calc(100% - 2rem);
    max-width: -webkit-fill-available;
  }
  .lookingForQuestion {
    max-width: -webkit-fill-available;
  }
  .stylized-dropdown {
    border: solid 1px;
    font-size: 2.5rem;
    left: 0;
    max-height: 50vh;
    max-width: 100%;
    min-width: unset;
    overflow: auto;
    text-transform: capitalize;
    top: 0;
    width: 100%;
    min-width: 320px;
    max-width: 414px !important;
    position: absolute;
    top: 50%;
    padding: 1rem;
    box-shadow: 0 0 20px rgb(0 0 0 / 20%);
    width: 100%;
    display: flex;
    flex-direction: column;
    &:last-of-type {
      width: 105% !important;
      max-width: unset;
    }
    li {
      cursor: pointer;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      position: relative;
      display: inline-flex;
      line-height: 1.5;
      margin-right: auto;
      position: relative;
      padding-right: 2rem;
      font-size: 1.1rem;
      font-style: normal;
      font-family: 'Futura Std';
      letter-spacing: 1px;
      text-transform: uppercase;
      &:after {
        background: var(--mp-coral);
        bottom: .1em;
        content: "";
        display: block;
        height: 45%;
        left: 0;
        opacity: 0;
        position: absolute;
        width: 92%;
        z-index: -1;
        transition: opacity ease-out .2s;
      }
      &:hover {
        &:after {
          opacity: .6;  
        }
      }
    }
  }
}
.items-start {
  .stylized-dropdown {
    &--first {
      z-index: 2;
    }
  }
}
</style>
