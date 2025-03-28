import React, { useCallback } from 'react';
import {
  NodeViewContent,
  NodeViewWrapper,
  type NodeViewProps,
} from '@tiptap/react';
import type { Node as ProseMirrorNode } from '@tiptap/pm/model';
import { Select } from 'antd/es';
import { prefix, codeLanguages } from '@/constants';
import { useLocale } from '@/context';
import { filterDataHTMLAttributes } from '@/utils';
import type CodeBlock from './index';

interface CodeBlockNodeAttributes extends Record<string, unknown> {
  /** 代码语言 */
  language: string;
}

interface CodeBlockNode extends ProseMirrorNode {
  attrs: CodeBlockNodeAttributes;
}

interface CodeBlockViewProps extends NodeViewProps {
  /** 节点实例 */
  node: CodeBlockNode;
  /** 扩展实例 */
  // @ts-ignore
  extension: typeof CodeBlock;
}

const { Option } = Select;

const useCodeBlock = (props: CodeBlockViewProps) => {
  const { editor, node, updateAttributes, extension } = props;
  const locale = useLocale();

  // 获取支持的语言列表
  const supportedLanguages = extension.options.lowlight.listLanguages();

  // 当前选中的语言
  const currentLanguage = node.attrs.language;

  // 处理语言变更
  const handleLanguageChange = useCallback(
    (language: string) => {
      updateAttributes({ language });
    },
    [updateAttributes],
  );

  // 是否显示语言选择器
  const showLanguageSelector = editor.isActive('codeBlock');

  return {
    locale,
    currentLanguage,
    supportedLanguages,
    showLanguageSelector,
    handleLanguageChange,
  };
};

export default function CodeBlockView(props: CodeBlockViewProps) {
  const { HTMLAttributes } = props;
  const {
    locale,
    currentLanguage,
    supportedLanguages,
    showLanguageSelector,
    handleLanguageChange,
  } = useCodeBlock(props);

  return (
    <NodeViewWrapper
      className={`${prefix}-code-block`}
      {...filterDataHTMLAttributes(HTMLAttributes)}
    >
      {showLanguageSelector && (
        <Select
          placeholder={locale.language}
          defaultValue={currentLanguage}
          onChange={handleLanguageChange}
        >
          {supportedLanguages.map((lang: string) => (
            <Option key={lang} value={lang}>
              {codeLanguages[lang as keyof typeof codeLanguages] || lang}
            </Option>
          ))}
        </Select>
      )}
      <pre>
        <NodeViewContent as="code" />
      </pre>
    </NodeViewWrapper>
  );
}
