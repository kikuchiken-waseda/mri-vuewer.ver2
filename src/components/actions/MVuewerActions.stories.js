import MVuewerActions from "./MVuewerActions.vue";
export default {
  component: MVuewerActions,
  argTypes: {
    mouseover: {
      action: "mouseover"
    },
    "download-click": {
      action: "download-click"
    },
    "upload-click": {
      action: "upload-click"
    }
  }
};

const Template = (_, { argTypes }) => ({
  components: { MVuewerActions },
  props: Object.keys(argTypes),
  template: `<MVuewerActions
      @mouseover="mouseover"
      @download-click="download-click"
      @upload-click="upload-click"
      v-bind="$props"
  />`
});

export const MVuewerActionsStory = Template.bind({});
MVuewerActionsStory.args = {
  fps: 13.84,
  longSkip: 5
};
