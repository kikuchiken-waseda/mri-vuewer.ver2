import MViewLayout from "./MViewLayout.vue";
export default {
  component: MViewLayout
};

const Template = (_, { argTypes }) => ({
  components: { MViewLayout },
  props: Object.keys(argTypes),
  template: `<MViewLayout :heading="heading" :desc="desc"/>`
});
export const MViewLayoutStory = Template.bind({});
MViewLayoutStory.args = {
  heading: "ヘッダー",
  desc: "説明"
};
