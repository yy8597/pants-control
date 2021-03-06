// @flow
import React, { Fragment } from 'react';
// wrappers to provide shared functionality
import WrapNodeMenu from './Formatter/NodeMenu';
import Parse from './Formatter/Parse';
// nodes are building blocks of document
import NewNoteButton from './Buttons/NewNoteButton';
import NoteList from './Facets/NoteList';
import TextNode from './Documents/Text';
import CodeNode from './Documents/Code';

export default function renderNodeWithWrapper(value, onChange) {
  return (props: *) => {
    const { attributes, children, node } = props;

    const BasicNodes = do {
      if (node.type === 'new-note-button') {
        <NewNoteButton>{children}</NewNoteButton>;
      } else if (node.type === 'note-list') {
        <NoteList>{children}</NoteList>;
      } else if (node.type === 'title') {
        <h2 {...attributes}>{children}</h2>;
      } else if (node.type === 'paragraph') {
        <TextNode {...attributes}>{children}</TextNode>;
      } else if (node.type === 'code_block') {
        <CodeNode {...attributes}>{children}</CodeNode>;
      }
    };
    const InlineNodes = do {
      if (node.type === 'parse') {
        <Parse {...attributes} value={value} onChange={onChange} node={node}>
          {children}
        </Parse>;
      } else if (node.type === 'code_line') {
        <pre {...attributes}>{children}</pre>;
      }
    };

    return BasicNodes ? (
      <WrapNodeMenu value={value} onChange={onChange} node={node}>
        {BasicNodes}
      </WrapNodeMenu>
    ) : (
      InlineNodes
    );
  };
}
