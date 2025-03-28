// 导出其他模块
export * from './download';
export * from './file';
export * from './upload';
export * from './editorLink';
export * from './extension';

/**
 * 延迟指定时间
 * @param time 延迟时间（毫秒）
 * @returns Promise
 */
export const sleep = (time = 0): Promise<void> =>
  // eslint-disable-next-line no-promise-executor-return
  new Promise((resolve) => setTimeout(resolve, time));

/**
 * 将emoji编码转换为实际字符
 * @param emoji emoji编码字符串，格式如 "1f600-1f64b"
 * @returns 转换后的emoji字符
 */
export const parseEmoji = (emoji: string): string => {
  if (!emoji) {
    return '';
  }

  try {
    return emoji
      .split('-')
      .map((hex) => String.fromCodePoint(parseInt(hex, 16)))
      .join('');
  } catch (e) {
    return emoji;
  }
};

/**
 * 将字节数转换为人类可读的格式
 * @param bytes 字节数
 * @returns 格式化后的字符串，如 "1.5 MB"
 */
export const prettyBytes = (bytes: number): string => {
  if (bytes === 0) {
    return '0 B';
  }

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  if (i >= sizes.length) {
    return `${(bytes / k ** (sizes.length - 1)).toFixed(2)} ${sizes[sizes.length - 1]}`;
  }

  const size = bytes / k ** i;
  const formattedSize = size % 1 === 0 ? size.toFixed(0) : size.toFixed(2);

  return `${formattedSize} ${sizes[i]}`;
};

/**
 * 过滤HTML属性，只保留data-开头的属性
 * @param HTMLAttributes HTML属性对象
 * @returns 只包含data-属性的对象
 */
export const filterDataHTMLAttributes = (
  HTMLAttributes: Record<string, string>,
): Record<string, string> => {
  if (!HTMLAttributes || typeof HTMLAttributes !== 'object') {
    return {};
  }

  return Object.entries(HTMLAttributes).reduce(
    (filtered, [key, value]) =>
      key.startsWith('data-') ? { ...filtered, [key]: value } : filtered,
    {},
  );
};
