import MFileUploadDialog from "./MFileUploadDialog.vue";
export default {
  component: MFileUploadDialog
};

const Template = (_, { argTypes }) => ({
  components: { MFileUploadDialog },
  props: Object.keys(argTypes),
  template: `<MFileUploadDialog :value="value" />`
});

export const MViewLayoutStory = Template.bind({});
MViewLayoutStory.args = {
  value: true
};
