import MHCard from "./MHCard.vue";

export default {
  component: MHCard
};

const Template = (_, { argTypes }) => ({
  components: { MHCard },
  props: Object.keys(argTypes),
  template: `
    <MHCard 
      :color="color"
      :icon="icon"
      :title="title"
      :sub-icon="subIcon"
      :sub-text="subText"
      :actions="actions"
      :value="value"
      :smallValue="smallValue"
    />`
});

export const Default = Template.bind({});
Default.args = {
  icon: "mdi-file-upload",
  color: "primary",
  title: "動画登録",
  subIcon: "mdi-information",
  subText: "時系列転転記の動画ファイルをインポートします",
  actions: [
    {
      icon: "mdi-plus",
      function: () => {}
    }
  ],
  value: "ストレージ",
  smallValue: "XXXXXXXXXX Mb"
};
