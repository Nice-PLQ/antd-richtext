import { TableCell } from '@tiptap/extension-table-cell';

export default TableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      bgColor: {
        default: null,
        parseHTML: (element) => element.dataset.bgColor,
        renderHTML: (attributes) => {
          const { bgColor } = attributes;
          if (bgColor === null) {
            return {};
          }
          return {
            'data-bg-color': bgColor,
            style: `background-color: ${bgColor}`,
          };
        },
      },
    };
  },
});
