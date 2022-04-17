import MVideoUploadMenu from "./MVideoUploadMenu.vue";
export default {
  component: MVideoUploadMenu
};
const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MVideoUploadMenu },
  template: `<MVideoUploadMenu v-bind="$props" />`
});
export const MVideoUploadMenuStory = Template.bind({});
