const locale = "$vuetify.validations";

const checkers = {
  positiveInteger: new RegExp(/^[0-9]+$/),
  positiveIntegerOrError: new RegExp(/^([0-9]+|-1)$/),
  positiveFloat: new RegExp(/^([1-9]\d*|0)(\.\d+)?$/)
};

const t = function(vm, locale) {
  if (vm.$vuetify) {
    return vm.$vuetify.lang.t(locale);
  }
  return "no vuetify";
};
const hasValue = (key, v) => v[key] !== undefined;

export default {
  computed: {
    videoRules: function() {
      if (this.$vuetify) {
        const vm = this;
        const maxSize = this.$store.state.setting.maxVideoSize;
        const mb = 1000000;
        const buff = "arrayBuffer";
        return [
          v => !!v || t(vm, `${locale}.required`),
          v =>
            !v ||
            v.size < maxSize * mb ||
            t(vm, `${locale}.maxVideoSize`),
          v =>
            !v ||
            hasValue(buff, v) ||
            t(vm, `${locale}.hasArrayBuffer`)
        ];
      }
      return [];
    },
    rules: function() {
      if (this.$vuetify) {
        const vm = this;
        const rules = {
          videoRules: this.videoRules
        };
        for (const key in checkers) {
          rules[`${key}Rules`] = [
            v => !!v || t(vm, `${locale}.required`),
            function(v) {
              return (
                checkers[key].test(v) || t(vm, `${locale}.${key}`)
              );
            }
          ];
        }
        return rules;
      }
      return {};
    }
  }
};
