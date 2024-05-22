export const joinPath = (base: string, path: string) =>
  [base, path]
    .join("/")
    .replace(/\/+/g, "/")
    .replace(/([^/]+)\/$/, "$1");
