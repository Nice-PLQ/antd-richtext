/**
 * 上传响应结果类型
 */
export interface UploadResponse {
  src: string;
  [key: string]: any;
}

/**
 * 上传配置接口
 */
export interface UploadConfig {
  /** 要上传的文件 */
  file: File;
  /** 上传地址 */
  url: string;
  /** 上传进度回调 */
  onProgress?: (progress: number) => void;
  /** 上传成功回调 */
  onSuccess?: (response: UploadResponse) => void;
  /** 上传失败回调 */
  onError?: (error?: Error) => void;
  /** 上传取消回调 */
  onAbort?: () => void;
  /** 自定义请求头 */
  headers?: Record<string, string>;
  /** 自定义表单字段名 */
  fieldName?: string;
}

/**
 * 解析XMLHttpRequest响应内容
 * @param xhr XMLHttpRequest实例
 * @returns 解析后的响应内容
 */
function parseResponse(xhr: XMLHttpRequest): any {
  const text = xhr.responseText || xhr.response;
  if (!text) {
    return text;
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    return text;
  }
}

/**
 * 上传文件
 * @param config 上传配置
 * @returns XMLHttpRequest实例，可用于取消上传
 */
export const uploadFile = (config: UploadConfig): XMLHttpRequest => {
  const {
    file,
    url,
    onProgress,
    onSuccess,
    onError,
    onAbort,
    headers = {},
    fieldName = 'file',
  } = config;

  if (!file) {
    throw new Error('文件不能为空');
  }

  const formData = new FormData();
  formData.append(fieldName, file);

  const xhr = new XMLHttpRequest();
  xhr.open('POST', url, true);

  // 设置请求头
  Object.entries(headers).forEach(([key, value]) => {
    xhr.setRequestHeader(key, value);
  });

  // 上传进度事件
  xhr.upload.addEventListener('progress', (e) => {
    if (e.total > 0) {
      onProgress?.((e.loaded / e.total) * 100);
    }
  });

  // 请求完成事件
  xhr.addEventListener('load', () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      const body = parseResponse(xhr);

      // 处理不同的响应格式
      let src = '';
      if (body && typeof body === 'object') {
        src = body.src || (body.data && body.data.src) || '';
      }

      onSuccess?.({ src, ...body });
    } else {
      onError?.(new Error(`上传失败: ${xhr.status} ${xhr.statusText}`));
    }
  });

  // 请求错误事件
  xhr.addEventListener('error', () => {
    onError?.(new Error('网络错误，上传失败'));
  });

  // 请求取消事件
  xhr.addEventListener('abort', () => {
    onAbort?.();
  });

  xhr.send(formData);
  return xhr;
};

/**
 * 取消文件上传
 * @param xhr XMLHttpRequest实例
 */
export const cancelUpload = (xhr: XMLHttpRequest): void => {
  if (xhr && xhr.readyState !== 4) {
    xhr.abort();
  }
};
