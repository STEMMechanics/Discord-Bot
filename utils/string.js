module.exports = {
  trimLines(lines) {
    const firstNonBlankLineIndex = lines.findIndex((line) => line.trim() !== '');
    let lastNonBlankLineIndex = lines.length - 1;
    while (lastNonBlankLineIndex >= 0 && lines[lastNonBlankLineIndex].trim() === '') {
      lastNonBlankLineIndex -= 1;
    }

    if (firstNonBlankLineIndex === -1 || lastNonBlankLineIndex < firstNonBlankLineIndex) {
      return [];
    }

    return lines;
  },
};
