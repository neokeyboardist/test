<script setup>
import { ref } from 'vue'
const transcript = ref('')
// const isRecording = ref(false)
const text = ref(null)

const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition

const sr = new Recognition()
sr.lang = 'ru-RU'
sr.continuous = true


const request = window.indexedDB.open('TextDB', 1);
let db

function displayData() {
  request.onsuccess = () => {
    db = request.result;
    const store = db.transaction('Texts').objectStore('Texts');
    store.getAll().onsuccess = (event) => {
      text.value = event.target.result
    }
  }
}

createDataStore()
displayData()

function addData() {
  const store = db.transaction('Texts', 'readwrite').objectStore('Texts');
  store.put(transcript.value).onsuccess = () => {
    text.value.push(transcript.value)
  }
}

function createDataStore() {
  request.onupgradeneeded = () => {
    db = request.result;
    if (db.objectStoreNames.length === 0) {
      db.createObjectStore('Texts', {
        autoIncrement: true
      });
    }
  }
}


sr.onstart = () => {
  console.log('SR Started')
  // isRecording.value = true
}

sr.onresult = (event) => {
  for (let i = 0; i < event.results.length; i++) {
    const result = event.results[i]
    // if (result.isFinal) CheckForCommand(result)
  }
  transcript.value = event.results[0][0].transcript
  addData()
}

sr.onend = () => {
  console.log('SR Stopped')
  // isRecording.value = false
}

const CheckForCommand = (result) => {
  const t = result[0].transcript;
  if (t.includes('stop recording')) {
    sr.stop()
  } else if (
    t.includes('what is the time') ||
    t.includes('what\'s the time')
  ) {
    sr.stop()
    alert(new Date().toLocaleTimeString())
    setTimeout(() => sr.start(), 100)
  }
}

const ToggleMic = () => sr.start()

</script>

<template>
  <div class="app">
    <button :class="`mic`" @click="ToggleMic">Record</button>
    <div v-for="(t, index) in text" :key="index">{{ t }}</div>
    <div>transcript: {{ transcript }}</div>
    <div>db: {{ db }}</div>
    <div>text: {{ text }}</div>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Fira sans', sans-serif;
}

body {
  background: #281936;
  color: #FFF;
}
</style>

