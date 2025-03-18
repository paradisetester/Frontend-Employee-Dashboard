// src/components/QuillEditor.jsx

import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css'; // Ensure Quill's CSS is imported
import debounce from 'lodash/debounce';

// Ensure custom Quill settings if required
const Block = Quill.import('blots/block');
Block.tagName = 'DIV';
Quill.register(Block, true);

const QuillEditor = ({ initialContent = '', placeholder = '', onContentChange }) => {
  const editorRef = useRef(null);
  const quillInstance = useRef(null);

  useEffect(() => {
    initializeEditor();

    // Cleanup on unmount
    return () => {
      if (quillInstance.current) {
        quillInstance.current.off('text-change', handleTextChange);
      }
    };
  }, []);

  useEffect(() => {
    if (quillInstance.current && quillInstance.current.root.innerHTML !== initialContent) {
      quillInstance.current.root.innerHTML = initialContent;
    }
  }, [initialContent]);

  const initializeEditor = () => {
    const toolbarOptions = getToolbarOptions();

    quillInstance.current = new Quill(editorRef.current, {
      theme: 'snow',
      modules: {
        toolbar: toolbarOptions,
      },
      placeholder: placeholder,
    });



    // Attach a debounced text-change handler
    quillInstance.current.on('text-change', debounce(handleTextChange, 500));
  };

  const handleTextChange = () => {
    if (onContentChange) {
      onContentChange(quillInstance.current.root.innerHTML);
    }
  };

  const getToolbarOptions = () => [
    [{ header: '1' }, { header: '2' }, { font: [] }, { size: [] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ script: 'sub' }, { script: 'super' }],
    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
    [{ align: [] }, { direction: 'rtl' }],
    ['blockquote', 'code-block'],
    ['link', 'image', 'video'],
    ['clean'],
  ];

  return (
    <div
      ref={editorRef}
      className="quill-editor-container"
      style={{ minHeight: '200px', border: '1px solid #ccc', borderRadius: '4px' }}
    ></div>
  );
};

export default QuillEditor;
