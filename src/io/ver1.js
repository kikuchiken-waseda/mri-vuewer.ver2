const loadPoints = obj => {
  const points = [];
  if (obj.points) {
    for (const p of obj.points) {
      if (p.data.time || p.data.time == 0) {
        points.push({
          time: p.data.time,
          text: p.attributes.label || ""
        });
      }
    }
  }
  return points;
};

const loadRegions = (obj, type) => {
  const regions = [];
  const regionsDown = [];
  const checked = [];
  if (obj.regions) {
    for (const i in obj.regions) {
      const r = obj.regions[i];
      if (type == "left") {
        if (r.start) {
          const text = i == 0 ? "" : obj.regions[i - 1].attributes.label || "";
          regions.push({ time: r.start, text: text });
        }
      } else if (type == "right") {
        if (r.end) {
          regions.push({ time: r.end, text: r.attributes.label || "" });
        }
      } else if (type == "up-down") {
        if (i % 2 == 0) {
          regions.push({ time: r.start, text: "" });
          regions.push({ time: r.end, text: r.attributes.label || "" });
        } else {
          regionsDown.push({ time: r.start, text: "" });
          regionsDown.push({ time: r.end, text: r.attributes.label || "" });
        }
      } else {
        if (i != 0) {
          if (r.start < obj.regions[i - 1].end) {
            const a = obj.regions[i];
            regions.push({ time: a.start, text: "" });
            regions[regions.length - 2].text = "";
            regions.push({ time: a.end, text: "" });
            checked.push([i, regions.length]);
          } else {
            if (r.start && r.end) {
              const text = r.attributes.label || "";
              regions.push({ time: r.start, text: "" });
              regions.push({ time: r.end, text: text });
            }
          }
        } else {
          if (r.start && r.end) {
            const text = r.attributes.label || "";
            regions.push({ time: r.start, text: "" });
            regions.push({ time: r.end, text: text });
          }
        }
      }
    }

    for (const i in checked) {
      const obj_idx = checked[i][0];
      const regions_idx = checked[i][1];
      if (regions_idx) {
        if (regions[regions_idx - 2]) {
          regions[regions_idx - 2].text =
            obj.regions[obj_idx - 1].attributes.label || "";
        }
      }
      if (i == checked.length - 1) {
        regions[regions_idx - 1].text =
          obj.regions[obj_idx].attributes.label || "";
      }
    }
  }
  if (regionsDown.length) {
    return { regions, regionsDown };
  }
  return { regions };
};

export default {
  loadTextGrid: (obj, type) => {
    const textgrid = {};
    const points = loadPoints(obj);
    if (points.length) textgrid["points"] = { type: "point", values: points };

    const { regions, regionsDown } = loadRegions(obj, type);
    if (regionsDown.length) {
      textgrid["region_up"] = { type: "interval", values: regions };
      textgrid["region_down"] = { type: "interval", values: regionsDown };
    } else {
      if (regions.length)
        textgrid["regions"] = { type: "interval", values: regions };
    }
    return textgrid;
  }
};
