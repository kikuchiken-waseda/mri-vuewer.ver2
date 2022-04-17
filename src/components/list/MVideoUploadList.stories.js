import MVideoUploadList from "./MVideoUploadList.vue";

export default {
  component: MVideoUploadList,
  argTypes: {
    click: {
      action: "click"
    }
  }
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MVideoUploadList },
  template: `<MVideoUploadList @click="onClick" v-bind="$props" />`
});

export const MVideoUploadListStory = Template.bind({});
