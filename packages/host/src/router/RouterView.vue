<template>
    <div>
      router
      <router-view/>
    </div>
</template>
<script lang="ts">

import { defineComponent } from "vue";
//@ts-ignore
// import Button from "dataMap/Button";
// import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src

export default defineComponent({
  name: "RouterView",

  setup(){
    console.log('RouterView1')
  }
});
</script>