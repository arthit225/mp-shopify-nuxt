<template>
  <footer class="footer bg-mp-cream relative" id="footer">    
    <section
      class="p-5 md:p-8 lg:pb-0 lg:pr-0 max-w-[48rem] mx-auto lg:max-w-full"
    >
      <div class="footer__subscribe-title">
        <h2
          class="
            saol-display-light-italic
            text-[2.688rem]
            md:text-[3.25rem] md:leading-[160%]
          "
        >
          {{ footerState.story.content.subscribe_form[0].title }}
        </h2>
      </div>

      <nav class="lg:flex justify-between gap-5">
        <SubscribeForm
          class="!text-left lg:w-1/3 mb-5 lg:mb-0 "
          :blok="footerState.story.content.subscribe_form[0]"
          :isInFooter="true"
        />
        <div class="lg:w-2/3 lg:flex items-start uppercase">
          <div
            class="
              lg:flex lg:w-3/5
              gap-10
              justify-center
              flex-1
              tracking-[2px]
              hidden
            "
          >
            <div 
              v-for="(column) in footerState.story.content.footer_columns"
              :key="column._uid"
              :data-key="column._uid"
              class="futura-std-medium"
            >
              <button class="uppercase text-sm tracking-[2px] mb-3 text-left">
                {{ column.title }}
              </button>
              <ul>
                <li
                  class="leading-[2]"
                  v-for="item in column.link_items"
                  :key="item._uid"
                >
                  <nuxt-link
                    :to="item.link.linktype == 'url' ? item.link.cached_url : '/' + item.link.cached_url"
                    :target="item.link.linktype == 'url' ? '_blank':'_self'"
                    class="text-mp-color-text-secondary text-xs fancy-underline"
                    >{{ item.text }}
                  </nuxt-link>
                </li>
              </ul>
            </div>
            <!-- <div class="futura-std-medium">
              <button class="uppercase text-sm tracking-[2px] mb-3 text-left">
                {{ footerState.story.content.footer_columns[1].title }}
              </button>
              <ul>
                <li
                  class="leading-[2]"
                  v-for="item in footerState.story.content.footer_columns[1]
                    .link_items"
                  :key="item._uid"
                >
                  <nuxt-link
                    :to="'/' + item.link.cached_url"
                    class="text-mp-color-text-secondary text-xs fancy-underline"
                    >{{ item.text }}
                  </nuxt-link>
                </li>
              </ul>
            </div> -->
          </div>
          <div class="footer__mobile-accordion">
            <SnippetsFooterAccordion
              :itemsArray="footerState.story.content.footer_columns"
            />
          </div>
          <div>
            <ul class="flex justify-center my-10 lg:mb-16 lg:-mt-2.5">
              <li
                v-for="social in footerState.story.content.socials"
                :key="social._uid"
              >
                <a
                  :href="social.link.cached_url"
                  target="_blank"
                  class="flex w-10 h-10 justify-center items-center"
                  :aria-label="'Link to' +  social.name"                  
                  >
                  <span class="inline-block">
                    <IconsFacebook v-if="social.name.toLowerCase() == 'facebook'" />
                    <IconsInstagram v-else-if="social.name.toLowerCase() == 'instagram'" />
                    <IconsTwitter v-else-if="social.name.toLowerCase() == 'twitter'" />
                    <IconsYoutube v-else-if="social.name.toLowerCase() == 'youtube'" />
                    <IconsTiktok v-else-if="social.name.toLowerCase() == 'tiktok'" />
                    <IconsSpotify v-else-if="social.name.toLowerCase() == 'spotify'" />
                    <span class="sr-only">{{ social.name }} Icon</span>
                  </span>
                </a>
              </li>
            </ul>
            <nav
              class="
                uppercase
                lg:hidden
                footer__bottom-text
                text-extra-small
                futura-std-regular
                tracking-[1px]
                mb-10
              "
            >
              <ul class="flex flex-wrap justify-center text-center">
                <li
                  v-for="item in footerState.story.content.bottom_links"
                  :key="item._uid"
                >
                  <nuxt-link
                    :to="
                      '/' + item.link.cached_url
                    "
                    >{{
                      item.text
                    }} 
                  </nuxt-link>| &nbsp;
                </li>
              </ul>
              <ul class="flex justify-center text-center">
                <li>
                  <a href="/"
                    >&copy;{{ footerState.story.content.copyright }}</a
                  >
                  All rights reserved
                </li>
              </ul>
            </nav>
            <div class="footer__logo mx-auto lg:mx-0 mr-1" aria-hidden="true">
              <IconsLogoMark />
            </div>
          </div>
        </div>
      </nav>

      <nav
        class="
          uppercase
          hidden
          lg:flex
          flex-wrap
          gap-x-10
          footer__bottom-text
          text-xs
          futura-std-regular
          tracking-[2px]
        "
      >
        <ul class="flex footer__legal-links">
          <li
            v-for="item in footerState.story.content.bottom_links"
            :key="item._uid"
          >
            <nuxt-link :to="'/' + item.link.cached_url" class=""
              >{{ item.text }}
            </nuxt-link>
          </li>
        </ul>
        <ul class="flex">
          <li class="text-xs">
            &copy; {{ footerState.story.content.copyright }}. All rights
            reserved 
          </li>
        </ul>
      </nav>
 
    </section>
  </footer>
</template>

<script setup>

const route = useRoute();

const version = route.query._storyblok || route.isDev ? "draft" : "published";
const storyblokApi = useStoryblokApi();
const { data } = await storyblokApi.get("cdn/stories/global-elements/footer", {
  version: version,
});
const footerState = reactive({ story: data.story });

</script>

<style lang="scss">
.footer {
  &__legal-links {
    a {
      &::after {
        content: " | ";
        display: inline-flex;
        width: 2em;
        justify-content: center;
      }
    }
    li:last-child {
      a {
        &::after {
          display: none;
        }
      }
    }
  }
  &__logo {
    max-width: 23.438rem;
    svg {
      width: 100%;
      height: 100%;
    }
  }
  &__bottom-text {
    max-width: 600px;
    line-height: 2;
    @screen md {
      // max-width: calc(100% - 23.438rem);
      // max-width: 600px;
      bottom: 0;
      padding-bottom: 8%;
      position: absolute;
    }
  }
  &__mobile-accordion {
    @screen lg {
      position: absolute;
      width: 0;
      overflow: hidden;
    }
    button {
      font-size: 0.75rem;
      line-height: 1.5rem;
      font-family: "Futura Std";
      font-weight: 500;
      letter-spacing: 1.2px;
      justify-content: space-between;
      width: 100%;
      padding-top: 0.75rem;
      padding-bottom: 0.625rem;

      span {
        width: 13px;
      }
    }
    & > ul > li {
      border-top: 1px solid;
      &:last-child {
        border-bottom: 1px solid;
      }
    }
    ul {
      ul {
        padding-bottom: 0.75rem;
        li {
          font-family: "Futura Std";
          font-size: 0.75rem;
          font-weight: 500;
          justify-content: space-between;
          letter-spacing: 1.2px;
          line-height: 1.5rem;
          color: #313131;
        }
      }
    }
  }
}
</style>
