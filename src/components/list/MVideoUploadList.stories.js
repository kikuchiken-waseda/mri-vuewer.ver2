import MVideoUploadList from "./MVideoUploadList.vue";

export default {
  component: MVideoUploadList,
  argTypes: {
    click: {
      action: "click"
    }
  }
};

const Template = (_, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MVideoUploadList },
  template: `<MVideoUploadList @click="click" v-bind="$props" />`
});

export const MVideoUploadListStory = Template.bind({});
