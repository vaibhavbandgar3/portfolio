/** Join class names, skipping falsy values. Small enough not to need clsx. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** True for absolute http(s) links, so they can open in a new tab. */
export function isExternal(href: string): boolean {
  return /^https?:\/\//.test(href);
}
