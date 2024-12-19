<template>
  <ul>
    <SidebarAccordionItem
      v-for="item in itemsArray"
      :key="item.title"
      :title="item.title"
      :children="childernArray(item.link_items)"
    />
  </ul>
</template>

<script setup>
const { itemsArray } = defineProps(['itemsArray'])

function childernArray(array) {
  const newArray = []
  array.forEach((item) => {
    const obj = {}
    obj.title = item.text
    obj.link = item.link
    newArray.push(obj)
  })
  return newArray;
}
</script>
