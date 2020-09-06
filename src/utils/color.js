import colors from "vuetify/lib/util/colors";

const toCss = function(string, $vuetify) {
  if (~string.indexOf("#")) return string;

  const theme = $vuetify.theme.themes.light;
  const keywords = Object.keys(theme);

  if (keywords.indexOf(string) !== -1) return theme[string];

  const strings = string.split(" ");
  const color = colors[strings[0]];
  if (color) {
    if (strings.length == 2) {
      const opt = strings[1].replace(/-/g, "");
      return colors[strings[0]][opt];
    }
    return colors[strings[0]].base;
  }
  return theme.primary;
};

export default {
  toCss: toCss
};
