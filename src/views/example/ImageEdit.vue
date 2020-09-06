<template>
  <m-view-layout :heading="heading" :desc="desc">
    <v-card>
      <v-file-input @change="onChange" accept="image/*" label="image file" />
    </v-card>

    <v-card v-if="src" class="mx-auto mt-5" max-width="400">
      <frame-editor :src="src" />
    </v-card>
  </m-view-layout>
</template>
<script>
import MViewLayout from "@/components/base/MViewLayout";
import FrameEditor from "@/components/video/MFrameEditor.vue";
import io from "@/io";
export default {
  name: "image-edit",
  components: {
    MViewLayout,
    FrameEditor
  },
  data: () => ({
    heading: "Example: ImageEdit",
    desc: "画像編集カードの例です",
    src: null
  }),
  methods: {
    onChange: async function(e) {
      this.src = null;
      if (e) {
        this.src = await io.file.toBase64(e);
      }
    }
  }
};
</script>

<style scoped></style>
