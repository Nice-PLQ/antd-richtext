import { Extension } from '@tiptap/react';

export const mergeExtension = (
  extensions: Extension[],
  otherExtension: Extension[],
) => {
  const map = new Map<string, Extension>();

  extensions.forEach((ext) => {
    map.set(ext.name, ext);
  });

  otherExtension.forEach((ext) => {
    map.set(ext.name, ext);
  });

  return Array.from(map.values());
};
