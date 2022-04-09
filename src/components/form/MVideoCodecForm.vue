<template>
  <v-form ref="form" v-model="valid">
    <v-text-field
      required
      v-model="video.name"
      :label="t('$vuetify.io.mVideoCodec.name')"
    />
    <v-text-field
      required
      v-model="video.fps"
      :rules="rules.positiveFloatRules"
      :label="t('$vuetify.io.mVideoCodec.fps')"
      :hint="video.errors.fps ? t(video.errors.fps) : ''"
      :persistent-hint="video.errors.fps ? !Boolean(video.fps) : false"
      suffix="fps"
    />
    <v-text-field
      required
      v-model="video.duration"
      :rules="rules.positiveFloatRules"
      :label="t('$vuetify.io.mVideoCodec.duration')"
      :hint="video.errors.duration ? t(video.errors.duration) : ''"
      :persistent-hint="
        video.errors.duration ? !Boolean(video.duration) : false
      "
      suffix="sec"
    />
    <v-text-field
      required
      v-model="video.originSize.width"
      :rules="rules.positiveFloatRules"
      :label="t('$vuetify.io.mVideoCodec.originSize.width')"
      :hint="
        video.errors.originSize.width ? t(video.errors.originSize.width) : ''
      "
      :persistent-hint="
        video.errors.originSize.width ? !Boolean(video.originSize.width) : false
      "
      suffix="pixel"
    />
    <v-text-field
      required
      v-model="video.originSize.height"
      :rules="rules.positiveFloatRules"
      :label="t('$vuetify.io.mVideoCodec.originSize.height')"
      :hint="
        video.errors.originSize.height ? t(video.errors.originSize.height) : ''
      "
      :persistent-hint="
        video.errors.originSize.height
          ? !Boolean(video.originSize.height)
          : false
      "
      suffix="pixel"
    />
  </v-form>
</template>
<script>
import io from "@/io";
import MValidationMixin from "@/mixins/MValidationMixin";
export default {
  name: "m-video-codec-form",
  mixins: [MValidationMixin],
  data: () => ({
    video: io.video.initObj(),
    valid: false
  }),
  props: {
    value: {
      type: Object,
      default: function() {
        return io.video.initObj();
      }
    }
  },
  methods: {
    t: function(val) {
      return this.$vuetify.lang.t(val);
    },
    validate: function() {
      this.$refs.form.validate();
      if (this.valid) {
        const item = {
          name: this.video.name,
          fps: Number(this.video.fps),
          duration: Number(this.video.duration),
          originSize: {
            width: Number(this.video.originSize.width),
            height: Number(this.video.originSize.height)
          }
        };
        this.$emit("validated", item);
      }
    },
    reset: function() {
      this.resetValidation();
      this.video = JSON.parse(JSON.stringify(this.value));
    },
    resetValidation: function() {
      this.$refs.form.resetValidation();
    }
  },
  mounted: function() {
    this.video = JSON.parse(JSON.stringify(this.value));
  }
};
</script>

<style scoped></style>
