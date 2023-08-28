import MJumbotron from "./MJumbotron.vue";
export default {
  component: MJumbotron
};

const Template = (_, { argTypes }) => ({
  components: { MJumbotron },
  props: Object.keys(argTypes),
  template: `<MJumbotron :heading="heading" :desc="desc"/>`
});
export const MJumbotronStory = Template.bind({});
MJumbotronStory.args = {
  heading: "ヘッダー",
  desc: "説明"
};
