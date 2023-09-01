import MvideoInput from "./MVideoInput.vue";

export default {
  component: MvideoInput,
  argTypes: {
    loading: { action: "loading" },
    loaded: { action: "loaded" }
  }
};

const Template = (_, { argTypes }) => ({
  components: { MvideoInput },
  props: { args: Object.keys(argTypes) },
  template: '<MvideoInput v-bind="args" />'
});

export const Default = Template.bind({});
Default.args = {};
