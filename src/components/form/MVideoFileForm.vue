<template>
  <v-form>
    <v-checkbox
      class="mt-0"
      hide-details
      v-model="$shouldGetVideoInfo"
      :label="t(`$vuetify.setting.form.loading.shouldGetVideoInfo.label`)"
    />
    <m-video-input
      v-if="$shouldGetVideoInfo"
      @loading="onLoading"
      @loaded="onLoaded"
    />
    <v-file-input
      v-else
      :label="`${t('$vuetify.io.mVideoInput.title')}*`"
      :rules="videoRules"
      accept="video/mp4"
      show-size
      @change="onChange"
    />
  </v-form>
</template>
<script>
import MValidationMixin from "@/mixins/MValidationMixin";
import MSettingMixin from "@/mixins/MSettingMixin.js";
import MVideoInput from "@/components/form/MVideoInput";
import io from "@/io";
export default {
  name: "m-video-file-form",
  mixins: [MValidationMixin, MSettingMixin],
  components: { MVideoInput },
  data: () => ({
    video: io.video.initObj()
  }),
  methods: {
    t: function(val) {
      return this.$vuetify.lang.t(val);
    },
    onChange: async function(e) {
      if (e) {
        if (e.size < this.maxVideoSize) {
          this.video.name = e.name;
          this.video.source = await io.file.toBase64(e);
          this.$emit("validated", this.video);
        }
      }
    },
    onLoading: function() {
      this.$emit("valideting");
    },
    onLoaded: function(payload) {
      if (payload) {
        this.video = payload;
        this.$emit("validated", this.video);
      }
    }
  },
  computed: {
    maxVideoSize: function() {
      return this.$store.state.setting.maxVideoSize * 1000000;
    }
  }
};
</script>

<style scoped></style>
