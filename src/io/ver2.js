export default {
  loadTextGrid: obj => {
    const textgrid = {};
    if (obj.name && obj.textgrid) {
      return obj.textgrid;
    } else {
      const textgrid = {};
      for (const key in obj) {
        const tier = obj[key];
        if (tier.type && tier.values) {
          if (tier.type == "interval" || tier.type == "point") {
            if (Array.isArray(tier.values)) textgrid[key] = tier;
          }
        }
      }
    }
    return textgrid;
  }
};
