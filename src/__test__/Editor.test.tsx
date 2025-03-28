import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import Editor from '@/EditorRender';

const content = `<h1>hello world~</h1>`;

test('render editor', () => {
  render(<Editor content={content} />);
  const element = screen.getByText(/at/i);
  // @ts-ignore
  expect(element).toBeInTheDocument();
});
