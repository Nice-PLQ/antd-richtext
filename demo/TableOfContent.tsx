import { MouseEvent } from 'react';
import cx from 'classnames';
import type { Editor } from '@tiptap/core';
import { Tag } from 'antd/es';

interface ToCItem {
  id: string;
  isActive: boolean;
  isScrolledOver: boolean;
  itemIndex: number;
  level: number;
  textContent: string;
}

const TableOfContent = ({
  items = [],
  editor,
}: {
  items: ToCItem[];
  editor?: Editor;
}) => {
  const onItemClick = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();

    if (editor) {
      const element = editor.view.dom.querySelector(`[data-toc-id="${id}"`);
      window.scrollTo({
        top:
          (element as HTMLElement).getBoundingClientRect().top +
          window.scrollY -
          44,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="table-of-contents">
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          onClick={(e) => onItemClick(e, item.id)}
          className={cx({
            'title-item': true,
            active: item.isActive,
            'scrolled-over': item.isScrolledOver,
          })}
          // @ts-ignore
          style={{ '--level': item.level }}
        >
          {item.textContent}
        </a>
      ))}
    </div>
  );
};

export default TableOfContent;
