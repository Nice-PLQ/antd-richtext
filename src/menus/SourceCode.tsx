import { useRef, useState, useEffect } from 'react';
import { Modal } from 'antd/es';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { ReactComponent as SourceCodeSvg } from '@/assets/icons/source-code.svg';
import MenuButton from '@/components/MenuButton';
import { useEditorContext, useLocale } from '@/context';

export default function MenuButtonCode() {
  const editor = useEditorContext();
  const locale = useLocale();

  const [visible, setVisible] = useState(false);
  const [htmlEditor, setHtmlEditor] =
    useState<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoEl = useRef(null);

  const showModal = () => setVisible(true);

  const handleOk = () => {
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  useEffect(() => {
    if (monacoEl.current) {
      console.log(monacoEl.current);
      setHtmlEditor((editor) => {
        if (editor) {
          return editor;
        }

        return monaco.editor.create(monacoEl.current!, {
          value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join(
            '\n',
          ),
          language: 'typescript',
        });
      });
    }

    return () => htmlEditor?.dispose();
  }, [visible, monacoEl.current]);

  return (
    <>
      <MenuButton
        tooltip={locale.code}
        icon={<SourceCodeSvg />}
        disabled={!editor?.isEditable}
        onClick={showModal}
      />
      <Modal
        width="60vw"
        title="HTML源代码"
        open={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div style={{ width: '100%', height: 300 }} ref={monacoEl}></div>
      </Modal>
    </>
  );
}
