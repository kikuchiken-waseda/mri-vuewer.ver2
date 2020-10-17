<template>
  <m-context-menu
    ref="menu"
    title="FRAME-EDITOR-MENU"
    color="warning darken-1"
    max-height="400"
    :items="items"
  >
    <slot></slot>
  </m-context-menu>
</template>
<script>
import MContextMenu from "@/components/base/MContextMenu";
export default {
  name: "m-frame-editor-context-menu",
  components: { MContextMenu },
  computed: {
    items: function() {
      const vm = this;
      const $click = payload => {
        return () => setTimeout(() => vm.$emit("click", payload), 10);
      };
      return [
        {
          text: "$vuetify.contexts.frame.download",
          icon: "mdi-download",
          kbd: "CTRL + S",
          click: $click("DOWNLOAD")
        },
        {
          text: "$vuetify.contexts.frame.copy",
          icon: "mdi-content-copy",
          kbd: "CTRL + C",
          click: $click("COPY")
        },
        {
          text: "$vuetify.contexts.skip",
          show: false,
          icon: "mdi-skip-next",
          items: [
            {
              text: "$vuetify.contexts.skipBackward",
              icon: "mdi-skip-previous",
              kbd: "J",
              click: $click("SKIP/PREV")
            },
            {
              text: "$vuetify.contexts.skipForward",
              icon: "mdi-skip-next",
              kbd: "K",
              click: $click("SKIP/NEXT")
            }
          ]
        },
        {
          text: "$vuetify.contexts.zoom",
          show: false,
          icon: "mdi-magnify-plus",
          items: [
            {
              text: "$vuetify.contexts.zoom_in",
              icon: "mdi-magnify-plus",
              kbd: "CTRL + +",
              click: $click("ZOOM/IN")
            },
            {
              text: "$vuetify.contexts.zoom_out",
              icon: "mdi-magnify-minus",
              kbd: "CTRL + -",
              click: $click("ZOOM/OUT")
            }
          ]
        },
        {
          text: "$vuetify.iFilter.name",
          show: false,
          icon: "mdi-image-filter-black-white",
          items: [
            {
              text: "$vuetify.iFilter.threshold",
              click: $click("FILTER/THRESHOLD")
            },
            {
              text: "$vuetify.iFilter.adaptiveThreshold",
              click: $click("FILTER/ADAPTIVE")
            },
            {
              text: "$vuetify.iFilter.canny",
              click: $click("FILTER/CANNY")
            },
            {
              text: "$vuetify.iFilter.bilateral",
              click: $click("FILTER/BILATERAL")
            },
            {
              text: "$vuetify.iFilter.laplacian",
              click: $click("FILTER/LAPLACIAN")
            },
            {
              text: "$vuetify.iFilter.concaveConvex",
              click: $click("FILTER/CONCAVECONVEX")
            }
          ]
        }
      ];
    }
  }
};
</script>

<style scoped></style>
