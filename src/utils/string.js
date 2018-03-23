import invariant from "invariant";

export const formatPackageString = infos => {
  invariant(
    typeof infos === "object",
    "[formatPackageString] You must pass an object of shape {scope, name, version}"
  );
  const { scope, name, version } = infos;
  let result = `${scope ? `@${scope}/${name}` : name}`;
  if (typeof version !== "undefined") {
    result += `@${version}`;
  }
  return result;
};

export const ucFirst = str => str.charAt(0).toUpperCase() + str.slice(1);
