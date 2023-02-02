function parseDate(str) {
  const parts = str.split(/[/-]/);

  if (parts.length === 3) {
    if (parts[2].length === 2) {
      parts[2] = `20${parts[2]}`;
    }
    if (parts[2].length !== 4 || /^-?\d+$/.test(parts[2]) === false || parseInt(parts[2], 10) < 1970 || parseInt(parts[1], 10) > 2050) {
      return '';
    }

    if (parts[1].length === 1) {
      parts[1] = `0${parts[1]}`;
    }
    if (parts[1].length !== 2 || /^-?\d+$/.test(parts[1]) === false || parseInt(parts[1], 10) < 0 || parseInt(parts[1], 10) > 12) {
      return '';
    }

    if (parts[0].length === 1) {
      parts[0] = `0${parts[0]}`;
    }
    if (parts[0].length !== 2 || /^-?\d+$/.test(parts[0]) === false) {
      return '';
    }

    if (parseInt(parts[0], 10) < 0
        || ([4, 6, 9, 11].includes(parseInt(parts[1], 10)) && parseInt(parts[0], 10) > 30)
        || (parseInt(parts[1], 10) === 2 && parseInt(parts[0], 10) > 29)
        || (parseInt(parts[0], 10) > 31)
    ) {
      return '';
    }

    return `${parts[0]}/${parts[1]}/${parts[2]}`;
  }

  return '';
}

module.exports = {
  parseDate,
};
