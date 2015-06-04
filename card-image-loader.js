module.exports = function(source) {
  this.cacheable && this.cacheable();
  return source.replace(`<svg`, `<svg viewBox="260 370 224 313" preserveAspectRatio="none"`);
}