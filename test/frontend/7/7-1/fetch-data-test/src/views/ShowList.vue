<script setup>
import { ref,onMounted } from 'vue';
import jsCookies from 'js-cookie'
let List = ref([])

let getList = async () => {
  const res = await fetch("http://localhost:5000/api/test",{
    credentials: "include"
  });
  if (res.status === 200) {
    List.value.push("test");

    console.log("select successful");
  } else {
    console.log("error by status " + res.status);
  }
};

let postList = async () => {
  const res = await fetch("http://localhost:5000/api/test",{
    method: "POST",
    body: JSON.stringify({test1: "name"}),
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include"
  });
  if (res.status === 201) {
    List.value.push(await res.json());

    console.log("select successful");
  } else {
    console.log("error by status " + res.status);
  }
};

onMounted(async () => {
  await getList();
  await postList();
});
</script>
 
<template>
<div>
  <ul v-for="(item,index) in List" :key="index">
    <li>{{item}}</li>
  </ul>
</div>
</template>
 
<style>
</style>
