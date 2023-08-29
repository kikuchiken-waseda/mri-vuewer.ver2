import MFrameEditorActions from "./MFrameEditorActions.vue";
export default {
  component: MFrameEditorActions,
  parameters: {
    viewport: {
      defaultViewport: "vDialog"
    }
  },
  argTypes: {
    skip: { action: "skip" },
    zoom: { action: "zoom" },
    download: { action: "download" }
  }
};

const Template = (_, { argTypes }) => ({
  components: { MFrameEditorActions },
  props: Object.keys(argTypes),
  template: `
    <MFrameEditorActions 
      @skip="skip"
      @zoom="zoom"
      @download="download"
    />
  `
});

export const MFrameEditorActionsStory = Template.bind({});
MFrameEditorActionsStory.args = {};
