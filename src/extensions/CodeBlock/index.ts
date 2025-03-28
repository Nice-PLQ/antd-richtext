import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { ReactNodeViewRenderer } from '@tiptap/react';
import css from 'highlight.js/lib/languages/css';
import js from 'highlight.js/lib/languages/javascript';
import ts from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import bash from 'highlight.js/lib/languages/bash';
import csharp from 'highlight.js/lib/languages/csharp';
import cpp from 'highlight.js/lib/languages/cpp';
import c from 'highlight.js/lib/languages/c';
import dart from 'highlight.js/lib/languages/dart';
import diff from 'highlight.js/lib/languages/diff';
import dockerfile from 'highlight.js/lib/languages/dockerfile';
import go from 'highlight.js/lib/languages/go';
import graphql from 'highlight.js/lib/languages/graphql';
import http from 'highlight.js/lib/languages/http';
import json from 'highlight.js/lib/languages/json';
import java from 'highlight.js/lib/languages/java';
import kotlin from 'highlight.js/lib/languages/kotlin';
import lua from 'highlight.js/lib/languages/lua';
import less from 'highlight.js/lib/languages/less';
import markdown from 'highlight.js/lib/languages/markdown';
import nginx from 'highlight.js/lib/languages/nginx';
import objectivec from 'highlight.js/lib/languages/objectivec';
import php from 'highlight.js/lib/languages/php';
import powershell from 'highlight.js/lib/languages/powershell';
import python from 'highlight.js/lib/languages/python';
import ruby from 'highlight.js/lib/languages/ruby';
import rust from 'highlight.js/lib/languages/rust';
import scss from 'highlight.js/lib/languages/scss';
import sql from 'highlight.js/lib/languages/sql';
import shell from 'highlight.js/lib/languages/shell';
import swift from 'highlight.js/lib/languages/swift';
import yaml from 'highlight.js/lib/languages/yaml';
import { createLowlight } from 'lowlight';
import View from './View';

const lowlight = createLowlight();

lowlight.register('html', xml);
lowlight.register('css', css);
lowlight.register('javascript', js);
lowlight.register('typescript', ts);
lowlight.register('bash', bash);
lowlight.register('csharp', csharp);
lowlight.register('cpp', cpp);
lowlight.register('c', c);
lowlight.register('dart', dart);
lowlight.register('diff', diff);
lowlight.register('dockerfile', dockerfile);
lowlight.register('go', go);
lowlight.register('graphql', graphql);
lowlight.register('http', http);
lowlight.register('json', json);
lowlight.register('java', java);
lowlight.register('kotlin', kotlin);
lowlight.register('lua', lua);
lowlight.register('less', less);
lowlight.register('markdown', markdown);
lowlight.register('nginx', nginx);
lowlight.register('objectivec', objectivec);
lowlight.register('php', php);
lowlight.register('powershell', powershell);
lowlight.register('python', python);
lowlight.register('ruby', ruby);
lowlight.register('rust', rust);
lowlight.register('scss', scss);
lowlight.register('sql', sql);
lowlight.register('shell', shell);
lowlight.register('swift', swift);
lowlight.register('xml', xml);
lowlight.register('yaml', yaml);

export default CodeBlockLowlight.extend({
  isolating: true,
  addNodeView() {
    return ReactNodeViewRenderer(View);
  },
}).configure({ lowlight });
