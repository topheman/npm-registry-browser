export const formatPackageString = ({ scope, name, version }) => {
  let result = `${scope ? `@${scope}/${name}` : name}`;
  if (typeof version !== "undefined") {
    result += `@${version}`;
  }
  return result;
};
