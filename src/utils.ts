export function joinRoute(...args: string[]) {
  return decodeURI(
    args
      .reduce(
        (url, pathname) => new URL(pathname.replace(/\/+/g, "/"), url),
        new URL("", location.origin)
      )
      .pathname.replace(/(.+)\/$/, "$1")
  );
}

export const nestRoute = (path: string) =>
  path
    .replace(/\/?((\.){3}|\*)$/, "")
    .replace(/\/(({|\[)(\.){3}.+(]|}))$/, "")
    .replace(
      /({|\[)([\w\.]+)(]|})/,
      (all, before, key, after) =>
        `${before}parent${key[0].toUpperCase() + key.slice(1)}${after}`
    );

export const baseRoute = (path: string, pathExp: string) => {
  const size = pathExp.replace(/\/?(({|\[)([\w\.]+)(]|})|\*)$/, "").split("/");
  return path.split("/").splice(0, size.length).join("/");
};
