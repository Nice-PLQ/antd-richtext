import { getMarkRange, getMarkType, type Editor } from '@tiptap/core';

/**
 * 获取链接文本内容
 * 如果当前位置有链接标记，则返回链接文本
 * 否则返回当前选择的文本
 */
export const getLinkText = (editor: Editor | null): string => {
  if (!editor) {
    return '';
  }

  const { selection, doc } = editor.state;
  const linkType = getMarkType('link', editor.schema);

  // 尝试获取链接的文本范围
  const linkRange = getMarkRange(selection.$to, linkType);

  // 如果找到链接范围，返回链接文本，否则返回选择的文本
  if (linkRange) {
    return doc.textBetween(linkRange.from, linkRange.to);
  }

  return doc.textBetween(selection.$from.pos, selection.$to.pos);
};

/**
 * 检查是否为有效的URL
 * 支持http/https协议，可选协议前缀
 */
export const isValidURL = (url: string): boolean => {
  if (!url || typeof url !== 'string') {
    return false;
  }

  // 更健壮的URL验证正则表达式
  const urlPattern = new RegExp(
    '^(https?:\\/\\/)?' + // 协议 - 可选
      '([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\\.)+' + // 域名
      '[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?' + // 二级域名
      '(:\\d{1,5})?' + // 端口 - 可选
      '(\\/[^\\s]*)?' + // 路径 - 可选
      '$',
    'i', // 不区分大小写
  );

  return urlPattern.test(url);
};

/**
 * 格式化URL，确保包含协议
 */
export const formatURL = (url: string): string => {
  if (!url) {
    return '';
  }

  // 如果URL不包含协议，添加https://
  if (!/^https?:\/\//i.test(url)) {
    return `https://${url}`;
  }

  return url;
};
