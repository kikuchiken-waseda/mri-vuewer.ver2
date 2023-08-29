import MFrameEditor from "./MFrameEditor.vue";
import { IMAGE_BASE64 } from "@/faker/image";
export default {
  component: MFrameEditor,
  parameters: {
    viewport: {
      defaultViewport: "vDialog"
    }
  },
  argTypes: {
    input: { action: "input" },
    skip: { action: "skip" },
    keyup: { action: "keyup" }
  }
};

const Template = (_, { argTypes }) => ({
  components: { MFrameEditor },
  props: Object.keys(argTypes),
  template: `
    <MFrameEditor
      :value="value"
      :height="height"
      @skip="skip"
      @input="input"
      @keyup="keyup"
  />`,
  mounted: function() {
    this.$store.commit("current/frame/idx", 1);
    this.$store.commit("current/frame/ow", 256);
    this.$store.commit("current/frame/oh", 256);
    this.$store.commit("current/frame/mode", "cric");
  }
});

export const MFrameEditorStory = Template.bind({});
MFrameEditorStory.args = {
  value: IMAGE_BASE64,
  height: "100%"
};
