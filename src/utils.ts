export function join(...args: string[]) {
  let path = args
    .filter((value) => value)
    .join("/")
    .replace(/\/+/g, "/");
  while (true) {
    const nextPath = path
      .replace(/\/[^\/]+\/\.\.\//g, "/")
      .replace(/\/+/g, "/");
    if (nextPath === path) break;
    path = nextPath;
  }
  return path;
}

export const nested = (path: string) =>
  path
    .replace(/\/({|\[)(\.){3}.+(]|})$/, "")
    .replace(
      /({|\[)([\w\.]+)(]|})/,
      (all, before, key, after) =>
        `${before}parent${key[0].toUpperCase() + key.slice(1)}${after}`
    );
