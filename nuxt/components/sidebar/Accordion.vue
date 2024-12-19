<template>
  <ul 
    v-if="sideBarMenuData.content.primary_menu"
    class="sidebar-accordion"
  >
    <SidebarAccordionItem
      v-for="item in sideBarMenuData.content.primary_menu[0].items"
      :key="item._uid"
      :title="item.text"
      :link="item.link"
      :children="item.site_nav_sub_items"
      :level="1"
    />
  </ul>
</template>

<script setup>
  const sideBarMenuData = inject('sideBarMenuData');
</script>
