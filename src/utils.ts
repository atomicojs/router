export function join(...args: string[]) {
  return decodeURI(
    new URL(
      args
        .filter((value) => value)
        .join("/")
        .replace(/\/+/g, "/"),
      location.origin
    ).pathname.replace(/(.+)\/$/, "$1")
  );
}

export const nested = (path: string) =>
  path
    .replace(/\/(({|\[)(\.){3}.+(]|})|(\.){3}|\*)$/, "")
    .replace(
      /({|\[)([\w\.]+)(]|})/,
      (all, before, key, after) =>
        `${before}parent${key[0].toUpperCase() + key.slice(1)}${after}`
    );
