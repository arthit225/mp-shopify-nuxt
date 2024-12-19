<template>
  <section
    class="location-hours"
    v-if="blok"
    :class="[
      blok.remove_margin ? '' : 'p-4 md:p-8'
    ]"
    v-editable="blok"
    :data-id="blok._uid"
    :data-component="blok.component"
    :id="blok._uid"
  >
    <div class="
        bg-black
        text-white
        md:py-[4.688rem] md:flex
        px-6
        md:px-0
        futura-std-medium
      ">
      <div class="py-[3.125rem] md:py-12 md:px-4 lg:px-20 md:w-2/3">
        <h2 class="uppercase mb-6 tracking-[.125rem]">
          {{ blok.small_heading ? blok.small_heading : 'VISIT US' }}
        </h2>
        <address
          class="
            mb-4
            heading-m
          "
          v-if="blok.address"
          v-html="blok.address"
        />
        <div v-if="blok.map_link">
          <nuxt-link
            :to="blok.map_link.url ? blok.map_link.url : '/'"
            class="
              inline-block
              mb-12
              text-xs
              leading-loose
              tracking-[.125rem]
              fancy-underline
              fancy-underline--has-underline
            "
          >
            MAP IT
          </nuxt-link>
        </div>
        <a
          v-if="blok.phone_number"
          :href="'tel:' + blok.phone_number"
          class="
            heading-m
            leading-none
            underline-offset-2
            decoration-white
            decoration-from-font
            fancy-underline
          "
        >
          {{ blok.phone_number }}
        </a>
      </div>
      <div class="
          py-[3.125rem]
          md:py-12 md:px-4
          lg:px-20
          border-t
          md:border-t-0
          md:border-l
          md:w-1/3
          tracking-[.125rem]
        ">
        <table class="w-full text-xs leading-[1.5rem]">
          <caption class="uppercase mb-6 text-left text-base">HOURS</caption>
          <tbody>
            <tr
              v-for="item in blok.Hours"
              :key="item._uuid"
            >
              <th class="text-left font-medium">{{ item.day }}</th>
              <td class="md-down:text-right">{{ item.hours }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script setup>
const { blok } = defineProps({ blok: Object });
onMounted(() => {
  console.log("blokky", blok);
});
</script>