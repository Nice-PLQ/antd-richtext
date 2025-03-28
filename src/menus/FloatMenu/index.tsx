import React, { useState, useRef, useEffect } from 'react';
import { Button, Popover } from 'antd/es';
import type { Editor } from '@tiptap/core';
import type { Node } from '@tiptap/pm/model';
import { HolderOutlined } from '@ant-design/icons';
import { prefix } from '@/constants';
import { useEditorContext } from '@/context';
import { createFloatMenuPlugin, floatMenuPluginKey } from './plugin';
import MenuList from './MenuList';
import { FloatMenuConfig } from './types';

interface Props {
  className?: string;
  config: FloatMenuConfig;
}

const FloatMenu: React.FC<Props> = (props) => {
  const { className, config } = props;

  const editor = useEditorContext();
  const [visible, setVisible] = useState(false);
  const [element, setElement] = useState(null);
  const [currentNode, setCurrentNode] = useState<Node | null>(null);
  const [currentNodePos, setCurrentNodePos] = useState<number>(-1);
  const pluginRef = useRef(null);

  useEffect(() => {
    if (element) {
      if (editor.isDestroyed) {
        return () => null;
      }

      if (!pluginRef.current) {
        pluginRef.current = createFloatMenuPlugin({
          editor,
          element,
          pluginKey: floatMenuPluginKey,
          onNodeChange: (data: {
            node: Node | null;
            editor: Editor;
            pos: number;
          }) => {
            if (data.node) {
              setCurrentNode(data.node);
            }

            setCurrentNodePos(data.pos);
          },
        });
        editor.registerPlugin(pluginRef.current);
      }

      return () => {
        editor.unregisterPlugin(floatMenuPluginKey);
      };
    }

    return () => null;
  }, [element, editor, floatMenuPluginKey]);

  const listener = (e: KeyboardEvent) => {
    if (e.key.toLowerCase() === 'escape') {
      setVisible(false);
    }
  };

  useEffect(() => {
    if (visible) {
      document.addEventListener('keydown', listener, false);
    }
    setVisible(visible as boolean);
    editor.commands.setMeta('lockFloatMenu', visible);

    return () => {
      document.removeEventListener('keydown', listener, false);
    };
  }, [visible]);

  return (
    <div className={className} ref={setElement}>
      <Popover
        trigger={['click']}
        placement="rightTop"
        overlayClassName={`${prefix}-float-menu`}
        open={visible}
        onOpenChange={(v) => setVisible(v)}
        showArrow={false}
        content={
          <MenuList
            pos={currentNodePos}
            node={currentNode}
            config={config}
            onClose={() => setVisible(false)}
          />
        }
      >
        <Button
          style={{
            display: 'inline-flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          icon={<HolderOutlined />}
          type="text"
          size="small"
          onClick={() => setVisible(true)}
        />
      </Popover>
    </div>
  );
};

export default FloatMenu;
