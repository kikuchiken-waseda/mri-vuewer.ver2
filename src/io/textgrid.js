export const dumpPointTier = function(values) {
  const lines = [];
  let index = 0;
  for (const i in values) {
    const value = values[i];
    const { text, time } = value;
    if (time) {
      lines.push(`        points [${index + 1}]:`);
      lines.push(`            number = ${time} `);
      lines.push(`            mark = "${text}" `);
      index++;
    }
  }
  return lines;
};

export const dumpIntervalTier = function(values, duration) {
  const lines = [];
  let index = 0;
  for (const i in values) {
    const value = values[i];
    const { text, time } = value;
    if (time) {
      lines.push(`        intervals [${index + 1}]:`);
      try {
        const xmin = values[i - 1].time;
        lines.push(`            xmin = ${xmin} `);
      } catch {
        lines.push("            xmin = 0 ");
      }
      if (i == values.length - 1) {
        lines.push(`            xmax = ${duration} `);
      } else {
        lines.push(`            xmax = ${time} `);
      }
      lines.push(`            text = "${text}" `);
      index++;
    }
  }
  return lines;
};

export const dumpTextGrid = (duration, tiers) => {
  let lines = [
    'File type = "ooTextFile"',
    'Object class = "TextGrid"',
    "",
    "xmin = 0 ",
    `xmax = ${duration} `,
    "tiers? <exists> ",
    `size = ${Object.keys(tiers).length} `,
    "item []: "
  ];
  let i = 1;
  for (const key in tiers) {
    const tier = tiers[key];
    const { type, values } = tier;
    lines.push(`    item [${i}]:`);
    if (type == "interval") {
      lines.push('        class = "IntervalTier"');
    } else {
      lines.push('        class = "TextTier"');
    }
    lines.push(`        name = "${key}" `);
    lines.push(`        xmin = 0 `);
    lines.push(`        xmax = ${duration} `);
    if (type == "point") {
      lines.push(`        points: size = ${values.length} `);
      lines = lines.concat(dumpPointTier(values));
    } else if (type == "interval") {
      if (values[values.length - 1].time < duration) {
        values.push({ text: "", time: duration });
      }
      lines.push(`        intervals: size = ${values.length} `);
      lines = lines.concat(dumpIntervalTier(values, duration));
    }
    i++;
  }
  return lines.join("\n");
};

export default {
  dump: dumpTextGrid
};
