import './index.scss';

export { default as Editor, type EditorRef } from './Editor';
export { default as EditorRender, type EditorRenderRef } from './EditorRender';
export { default as LocaleProvider } from './i18n';
export { default as MenuContainer } from './components/MenuContainer';
export { default as FileHandler } from './extensions/FileHandler';
export { prefix } from './constants';
export * from './context';
export * from './menus';
export { default as FloatMenu } from './menus/FloatMenu';

const version = typeof PKG_VERSION === 'undefined' ? '' : PKG_VERSION;

export { version };
