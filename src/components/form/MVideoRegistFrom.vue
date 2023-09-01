<template>
  <v-stepper v-model="e1">
    <v-stepper-header>
      <template v-for="n in nSteps">
        <v-stepper-step :key="`${n}-step`" :step="n" />
        <v-divider v-if="n !== nSteps" :key="n" />
      </template>
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content class="pb-0" step="1">
        <v-card>
          <v-card-title>
            <span class="ml-2">{{ stepName }}</span>
            <m-help text="$vuetify.forms.video.desc.select" />
          </v-card-title>
          <v-card-text>
            <m-video-file-form
              v-if="e1 == 1"
              @validated="onValidateVideo"
            />
          </v-card-text>
        </v-card>
      </v-stepper-content>

      <v-stepper-content step="2">
        <v-card>
          <v-card-title>
            <span class="ml-2">{{ stepName }}</span>
            <m-help text="$vuetify.forms.video.desc.confirmation" />
          </v-card-title>
          <v-card-text>
            <m-video-codec-form
              v-if="e1 == 2"
              @validated="onValidateCodec"
              ref="codecForm"
              :value="video"
            />
          </v-card-text>
          <v-card-actions>
            <v-btn text @click="prevStep">
              {{ t("$vuetify.prev") }}
            </v-btn>
            <v-spacer />
            <v-btn color="error" @click="resetCodecForm">reset</v-btn>
            <v-btn color="primary" @click="validateCodecForm">
              ok
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-stepper-content>

      <v-stepper-content step="3">
        <v-card v-if="isFinishEditMeta">
          <v-card-text v-if="isSaved">
            <v-alert type="success">
              {{ t("$vuetify.forms.video.finish") }}
            </v-alert>
          </v-card-text>
          <m-loading-card v-else :value="progress">
            {{ converting.status }} ({{ converting.step }} /
            {{ converting.total }})
          </m-loading-card>
          <v-card-actions v-if="isSaved && movePage == false">
            <slot name="finishedActions">
              <v-spacer />
              <v-btn color="primary" @click="restart">
                {{ t("$vuetify.forms.video.restart") }}
              </v-btn>
            </slot>
          </v-card-actions>
        </v-card>
        <v-card v-else>
          <v-card-title>
            <span class="ml-2">{{ stepName }}</span>
            <m-help text="$vuetify.forms.video.desc.meta" />
          </v-card-title>
          <v-card-text>
            <m-video-meta-data-form
              v-if="video.name"
              :currentItem="metadata"
              @validated="onValidateMetaData"
              ref="metaForm"
            />
          </v-card-text>
          <v-card-actions>
            <v-btn text @click="prevStep">
              {{ t("$vuetify.prev") }}
            </v-btn>
            <v-spacer />
            <v-btn color="error" @click="resetMetaDataForm">
              reset
            </v-btn>
            <v-btn color="primary" @click="validateMetaDataForm">
              ok
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>
<script>
import MHelp from "@/components/base/MHelp";
import MLoadingCard from "@/components/base/card/MLoadingCard";
import MVideoFileForm from "@/components/form/MVideoFileForm";
import MVideoCodecForm from "@/components/form/MVideoCodecForm";
import MVideoMetaDataForm from "@/components/form/MVideoMetaDataForm";
import MSettingMixin from "@/mixins/MSettingMixin.js";
import io from "@/io";
export default {
  name: "m-video-regist-from",
  mixins: [MSettingMixin],
  components: {
    MHelp,
    MLoadingCard,
    MVideoFileForm,
    MVideoCodecForm,
    MVideoMetaDataForm
  },
  data: () => ({
    e1: 1,
    loading: {
      show: false,
      status: ""
    },
    converting: {
      src: "",
      status: "",
      doing: false,
      step: 0,
      total: 0
    },
    isFinishEditMeta: false,
    isSaved: false,
    steps: ["select", "confirmation", "meta"],
    video: io.video.initObj()
  }),
  computed: {
    movePage: function() {
      return this.$store.state.setting.shouldMovePageAferAddingFile;
    },
    shouldGetFrameInfo: function() {
      return this.$store.state.setting.shouldGetFrameInfo;
    },
    canvasStyle: function() {
      if (this.video.originSize) {
        return {
          width: `${this.video.originSize.width}px`,
          height: `${this.video.originSize.height}px`
        };
      } else {
        return {
          width: "0px",
          height: "0px"
        };
      }
    },
    progress: function() {
      if (this.converting.total) {
        return 100 * (this.converting.step / this.converting.total);
      }
      return 0;
    },
    stepName: function() {
      return this.t(
        `$vuetify.forms.video.steps.${this.steps[this.e1 - 1]}`
      );
    },
    nSteps: function() {
      return this.steps.length;
    },
    metadata: function() {
      if (this.video.name) {
        const data = this.$store.getters["setting/fname2meta"](
          this.video.name
        );
        if (data) return data;
      }
      return {};
    }
  },
  methods: {
    t: function(val) {
      return this.$vuetify.lang.t(val);
    },
    pushFile: function() {
      this.$store
        .dispatch("files/push", this.video)
        .then(x => {
          this.isSaved = true;
          this.$emit("loaded", x);
        })
        .catch(error => {
          this.$emit("error", error);
        });
    },
    restart: function() {
      this.e1 = 1;
      this.loading = { show: false, status: "" };
      this.converting = {
        src: "",
        status: "",
        doing: false,
        step: 0,
        total: 0
      };
      this.isFinishEditMeta = false;
      this.isSaved = false;
      this.steps = ["select", "confirmation", "meta"];
      this.video = io.video.initObj();
    },
    startConvert: function() {
      this.converting.doing = true;
      this.converting.status = `converting video to images...`;
      this.video.frames = [];
      this.converting.step = 0;
      this.converting.total = Math.floor(
        this.video.duration * this.video.fps
      );

      const frameRate = 1 / this.video.fps;
      let currentTime = 0;
      while (this.converting.step < this.converting.total) {
        this.converting.step++;
        currentTime = currentTime + frameRate;
        this.video.frames.push({
          idx: this.converting.step,
          time: currentTime
        });
      }
      this.converting.doing = false;
      if (this.isFinishEditMeta) {
        this.pushFile();
      }
    },
    prevStep() {
      if (this.e1 == 2) {
        this.video = io.video.initObj();
        this.e1 = 1;
      }
      if (this.e1 == 3) {
        this.video.frames = [];
        this.isFinishEditMeta = false;
        this.converting = {
          src: "",
          status: "",
          doing: false,
          step: 0,
          total: 0
        };
        this.e1 = 2;
      }
    },
    nextStep(n) {
      if (n === this.steps) {
        this.e1 = 1;
      } else {
        this.e1 = n + 1;
      }
    },
    resetCodecForm() {
      this.$refs.codecForm.reset();
    },
    validateCodecForm() {
      this.$refs.codecForm.validate();
    },
    resetMetaDataForm() {
      this.$refs.metaForm.reset();
    },
    validateMetaDataForm() {
      this.$refs.metaForm.validate();
    },
    onLoading: function() {},
    onValidateVideo: function(payload) {
      if (payload) {
        this.video = payload;
        this.nextStep(1);
      }
    },
    onValidateCodec: function(payload) {
      this.video.name = payload.name;
      this.video.fps = payload.fps;
      this.video.duration = payload.duration;
      this.video.originSize.width = payload.originSize.width;
      this.video.originSize.height = payload.originSize.height;
      if (this.shouldGetFrameInfo && this.video.source) {
        this.startConvert();
      }
      this.nextStep(2);
    },
    onValidateMetaData: function(payload) {
      if (payload) {
        this.video.metaData = payload;
        this.video.textgrid = {};
        this.isFinishEditMeta = true;
        if (!this.converting.doing) {
          if (this.video) {
            this.pushFile();
          }
        }
      } else {
        this.video.metaData = {};
      }
    }
  },
  beforeDestroy: function() {
    this.video = null;
  }
};
</script>

<style scoped></style>
