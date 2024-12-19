<template>
  <div
    class="aselect text-xs tracking-wider uppercase"    
    :data-value="value"
    :data-list="options"
    :class="{
      'z-10': visible
    }"
  >
    <div class="selector w-ful uppercase" @click="toggle()">
      <div class="label">
        <span>{{ value }}</span>
      </div>
      <div class="arrow" :class="{ expanded : visible }"></div>
      <div :class="{ hidden : !visible, visible }">
        <ul>
          <li
            :class="{ current : item === value }"
            v-for="item in options"
            :key="item"
            @click="select(item)">
            {{ item }}
          </li>
        </ul>
      </div>
    </div>
	</div>
</template>
<script setup>
const visible = ref(false)
const emit = defineEmits(["update:modelValue"]);
const {options, modelValue} = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  options: {
    type: Array,
  }
});
const  value = ref(modelValue)
function toggle() {
  visible.value = !visible.value;
}
function select(option) {
  value.value = option;
  emit('update:modelValue', option)
}
</script>
<style lang="scss" scoped>
.aselect {
    margin: auto;
    
		.selector {
			border: 1px solid gainsboro;
			position: relative;
			z-index: 1;
			.arrow {
				position: absolute;
				border-bottom: 1px solid #000;
        border-right: 1px solid #000;
        content: "";
        display: block;
        height: 0.5rem;
        margin-top: -3px;
        position: absolute;
        right: 0.5rem;
        top: 50%;
        transform: rotate(45deg) translateY(-50%);
        transform-origin: 50% 0;
        transition: all .4s ease-in-out;
        width: 0.5rem;
			}
			.expanded {
				transform: rotate(225deg) translateY(-10px);
			}
			.label {
				display: block;
				padding: 12px;
			}
		}
		ul {
			width: 100%;
			list-style-type: none;
      padding: 0;
      margin: 0;
			border: 1px solid gainsboro;
			position: absolute;
			z-index: 1;
      background: #fff;
		}
		li {
			padding: 12px;
      cursor: pointer;
			&:hover {
				// color: white;
				background: var(--mp-cream);
			}
		}
		.current {
			background: var(--mp-cream);
		}
		.hidden {
			visibility: hidden;
		}
		.visible {
			visibility: visible;
		}
	}
</style>