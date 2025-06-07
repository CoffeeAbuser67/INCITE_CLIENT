import React, { useCallback, useEffect, useState } from 'react';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';

import { Box } from '@radix-ui/themes';
import { Mark, mergeAttributes } from '@tiptap/core';


const TextClass = Mark.create({
  name: 'textClass',
  addAttributes() {
    return {
      class: {
        default: null,
        parseHTML: element => element.getAttribute('class'),
        renderHTML: attributes => {
          if (!attributes.class) {
            return {};
          }
          return { class: attributes.class };
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: 'span[class]', getAttrs: node => node.getAttribute('class') ? {} : false }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },

  addCommands() {
    return {
      setTextClass:
        (className: string) =>
          ({ commands }: { commands: any }) => {
            if (!className) {
              return commands.unsetMark(this.name);
            }
            return commands.setMark(this.name, { class: className });
          },
    } as Partial<Record<string, any>>;
  },

});


const Toolbar = ({ editor }) => {
  if (!editor) return null;

  // Opções para o seletor de tamanho
  const FONT_OPTIONS = [
    { label: 'Pequeno', value: 'text-small' },
    { label: 'Grande', value: 'text-large' },
    { label: 'Subtítulo', value: 'text-subtitle' },
  ];

  // Lógica para o seletor de tamanho
  const activeFontSize = FONT_OPTIONS.find(option => editor.isActive('textClass', { class: option.value }))?.value || '';

  const handleFontSizeChange = (e) => {
    const className = e.target.value;
    editor.chain().focus().setTextClass(className).run();
  };

  const addImage = () => {
    const url = window.prompt('URL da Imagem:'); // Placeholder
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  // Classes base para os botões
  const baseButtonClass = "px-3 py-1.5 text-sm font-medium border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";
  const activeButtonClass = "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700";

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 p-2 bg-gray-100 border-b border-gray-300">

      {/* --- BOTÃO DE NEGRITO CORRIGIDO --- */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()} // A CORREÇÃO ESTÁ AQUI
        className={`${baseButtonClass} ${editor.isActive('bold') ? activeButtonClass : ''}`}
      >
        Negrito
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`${baseButtonClass} ${editor.isActive('italic') ? activeButtonClass : ''}`}
      >
        Itálico
      </button>

      {/* --- SELETOR DE TAMANHO --- */}
      <select
        value={activeFontSize}
        onChange={handleFontSizeChange}
        className={baseButtonClass}
      >
        <option value="">Normal</option>
        {FONT_OPTIONS.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {/* --- BOTÕES DE ALINHAMENTO --- */}
      <div className="flex items-center">
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`${baseButtonClass} rounded-r-none ${editor.isActive({ textAlign: 'left' }) ? activeButtonClass : ''}`}
        >
          Esq.
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`${baseButtonClass} rounded-none border-x-0 ${editor.isActive({ textAlign: 'center' }) ? activeButtonClass : ''}`}
        >
          Centro
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`${baseButtonClass} rounded-l-none border-x-0 ${editor.isActive({ textAlign: 'right' }) ? activeButtonClass : ''}`}
        >
          Dir.
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className={`${baseButtonClass} rounded-l-none ${editor.isActive({ textAlign: 'justify' }) ? activeButtonClass : ''}`}
        >
          Just.
        </button>
      </div>

      {/* --- BOTÃO DE IMAGEM --- */}
      <button onClick={addImage} className={baseButtonClass}>
        Imagem
      </button>
    </div>
  );
};


const PostEditor = ({ onContentChange }) => {
  const editor = useEditor({

    extensions: [
      StarterKit.configure({
        // O bold, italic, etc., já vêm no StarterKit, por isso eles funcionam
        heading: { levels: [2, 3] },
      }),
      Image,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextClass,
    ],

    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base focus:outline-none p-4 min-h-[400px] w-full',
      },
    },
    content: '<p>Comece a escrever o corpo do seu post aqui...</p>',
    onUpdate: ({ editor }) => onContentChange(editor.getHTML()),
  });

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );

};


function BlogDashboard() {
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');

  const handleSavePost = () => {

    // Agora você slva o título e o conteúdo!
    const postData = {
      title: postTitle,
      content: postContent,

    };
    console.log("Salvando o post no backend:", postData);
    alert("Post pronto para ser salvo!");
  };

  return (

    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Criar Novo Post</h1>
      {/* -> Campo de Título Dedicado <- */}

      <input
        type="text"
        value={postTitle}
        onChange={(e) => setPostTitle(e.target.value)}
        placeholder="Título do Post"
        className="w-full text-4xl font-extrabold p-2 mb-6 border-b-2 border-gray-300 focus:border-indigo-500 focus:outline-none"
      />

      <PostEditor onContentChange={setPostContent} />
      <button
        onClick={handleSavePost}
        className="mt-6 px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75"
      >
        Salvar Post
      </button>

    </div>
  );
}


const Settings = () => { // ★ Settings ✦───────────────────────────────────────────────────➤
  return (   // ── ◯─◡◠◡◠◡◠ DOM ◡◠◡◠◡◠◡◠─➤
    <div
      id="canvas"
      className="flex flex-col gap-10 justify-center items-center p-6"
    >
      {/* <Box // <○> UserPanel
      >
        <UserPanel />
      </Box> */}

      <Box>
        <BlogDashboard />
      </Box>
    </div>
  );
}; // ★ ✦─────────────────────────────────────────────────────➤

export default Settings;