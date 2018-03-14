export const formatPackageString = ({ scope, name, version }) => {
  let result = `${scope ? `@${scope}/${name}` : name}`;
  if (typeof version !== "undefined") {
    result += `@${version}`;
  }
  return result;
};

export const ucFirst = str => str.charAt(0).toUpperCase() + str.slice(1);
