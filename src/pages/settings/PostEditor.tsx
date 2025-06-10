
import React, { useEffect, useState } from 'react';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import { Mark, mergeAttributes } from '@tiptap/core';
import { UploadCloud, X, FileImage, LoaderCircle } from 'lucide-react';
import { Dialog, Button, TextField, Text } from '@radix-ui/themes'; // Usando componentes Radix


// Interface para as propriedades do nosso componente
interface ImageUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImageUploaded: (url: string) => void;
}

// ● ImageUploadModal
const ImageUploadModal = ({ isOpen, onClose, onImageUploaded }: ImageUploadModalProps) => {
    // --- Estados do Componente ---
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // --- Funções de Validação e Manipulação de Arquivo ---
    const validateFile = (selectedFile: File): boolean => {
        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(selectedFile.type)) {
            setError('Tipo de arquivo inválido. Use JPEG, PNG ou WEBP.');
            return false;
        }
        const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
        if (selectedFile.size > maxSizeInBytes) {
            setError(`A imagem é muito grande. O máximo é 2MB.`);
            return false;
        }
        setError(null);
        return true;
    };

    const handleFileSelected = (files: FileList | null) => {
        if (files && files[0]) {
            if (validateFile(files[0])) {
                setFile(files[0]);
            }
        }
    };

    // --- Handlers de Drag and Drop ---
    const handleDragEvent = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDropEvent = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        handleFileSelected(e.dataTransfer.files);
    };

    // --- Lógica de Upload (Simulada) ---
    const handleUpload = async () => {
        if (!file) return;
        setIsUploading(true);

        // SIMULAÇÃO DE UPLOAD: A chamada real para sua API entraria aqui.
        console.log('Iniciando upload simulado...');
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simula 2s de rede

        const fakeUrl = `https://picsum.photos/seed/${Math.random()}/800/400`;
        console.log('Upload simulado concluído. URL:', fakeUrl);

        onImageUploaded(fakeUrl); // Envia a URL de volta para o editor
        closeAndReset(); // Fecha e reseta a modal
    };

    // --- Função para fechar e limpar o estado da modal ---
    const closeAndReset = () => {
        setFile(null);
        setError(null);
        setIsUploading(false);
        setDragActive(false);
        onClose();
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={closeAndReset}>
            <Dialog.Content style={{ maxWidth: 450 }}>
                <Dialog.Title>Adicionar Imagem</Dialog.Title>
                <Dialog.Description size="2" mb="4">
                    Arraste um arquivo ou selecione no seu computador.
                </Dialog.Description>

                <div
                    className={`relative border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${dragActive ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300 hover:border-gray-400'}`}
                    onDragEnter={handleDragEvent} onDragLeave={handleDragEvent} onDragOver={handleDragEvent} onDrop={handleDropEvent}
                    onClick={() => document.getElementById('file-upload-input')?.click()}
                >
                    <input id="file-upload-input" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={(e) => handleFileSelected(e.target.files)} />
                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">Arraste e solte ou clique para selecionar</p>
                </div>

                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

                {file && !error && (
                    <div className="mt-4 flex items-center justify-between p-2 bg-gray-50 rounded-md">
                        <div className="flex items-center gap-2 truncate">
                            <FileImage className="h-5 w-5 text-gray-500 flex-shrink-0" />
                            <span className="text-sm font-medium text-gray-700 truncate">{file.name}</span>
                        </div>
                        <button onClick={() => setFile(null)}><X className="h-4 w-4 text-gray-500 hover:text-red-600" /></button>
                    </div>
                )}

                <div className="mt-5 flex justify-end gap-3">
                    <Dialog.Close>
                        <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">Cancelar</button>
                    </Dialog.Close>
                    <button
                        onClick={handleUpload}
                        disabled={!file || !!error || isUploading}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed"
                    >
                        {isUploading && <LoaderCircle className="animate-spin -ml-1 mr-2 h-5 w-5" />}
                        {isUploading ? 'Enviando...' : 'Adicionar'}
                    </button>
                </div>
            </Dialog.Content>
        </Dialog.Root>
    );
};

// ● TextClass
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

// ● Toolbar
const Toolbar = ({ editor }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!editor) return null;
    // Função para inserir a imagem recebida da modal
    const handleImageInsert = (url: string) => {
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

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

        <>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 p-2 bg-gray-100 border-b border-gray-300">
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

                <button onClick={() => setIsModalOpen(true)} className={baseButtonClass}>
                    Imagem
                </button>

            </div>


            <ImageUploadModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onImageUploaded={handleImageInsert}
            />
        </>

    );
};

interface PostEditorDashboardProps {
    initialTitle?: string;
    initialContent?: string;
    onSave: (data: { title: string; content: string }) => void;
    onCancel: () => void;
}


const PostEditorDashboard = ({
    initialTitle = '',
    initialContent = '',
    onSave,
    onCancel,
}: PostEditorDashboardProps) => {

    const [postTitle, setPostTitle] = useState(initialTitle);
    const [postContent, setPostContent] = useState(initialContent);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({ heading: { levels: [2, 3] } }),
            Image,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            TextClass,
        ],
        content: initialContent, // Inicia com o conteúdo passado via prop
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose-base focus:outline-none p-4 min-h-[300px] w-full bg-white',
            },
        },
        onUpdate: ({ editor }) => {
            setPostContent(editor.getHTML());
        },
    });


    useEffect(() => {
        if (editor && initialContent !== editor.getHTML()) {
            editor.commands.setContent(initialContent, false);
            setPostTitle(initialTitle); // Sincroniza o título também
        }
    }, [initialContent, initialTitle, editor]);

    const handleSaveClick = () => {
        onSave({ title: postTitle, content: postContent });
    };

    return (
        <div className="border border-gray-300 rounded-lg shadow-sm">
            <div className="p-4 bg-gray-50">
                <label>
                    <Text as="div" size="2" mb="1" weight="bold">Título da Postagem</Text>
                    <TextField.Root
                        size="3"
                        value={postTitle}
                        onChange={(e) => setPostTitle(e.target.value)}
                        placeholder="Título do Post"
                    />
                </label>
            </div>
            <div className='border-y border-gray-200'>
                <Toolbar editor={editor} />
                <EditorContent editor={editor} />
            </div>
            <div className="flex justify-end gap-3 p-4 bg-gray-50">
                <Button variant="soft" color="gray" onClick={onCancel}>Cancelar</Button>
                <Button onClick={handleSaveClick}>Salvar Postagem</Button>
            </div>
        </div>
    );
};



export default PostEditorDashboard;
























