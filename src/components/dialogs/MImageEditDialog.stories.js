import MImageEditDialog from "./MImageEditDialog.vue";
import { IMAGE_BASE64 } from "@/faker/image";
export default {
  component: MImageEditDialog,
  argTypes: {
    input: { action: "input" }
  }
};

const Template = (_, { argTypes }) => ({
  components: { MImageEditDialog },
  props: Object.keys(argTypes),
  mounted: function() {
    this.$store.commit("current/frame/src", IMAGE_BASE64);
    this.$store.commit("current/frame/ow", 256);
    this.$store.commit("current/frame/oh", 256);
  },
  template: `<MImageEditDialog :value="value" />`
});

export const MImageEditDialogStory = Template.bind({});
MImageEditDialogStory.args = {
  value: true
};
