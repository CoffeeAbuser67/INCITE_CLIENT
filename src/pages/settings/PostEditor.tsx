import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import UnderlineExtension from '@tiptap/extension-underline';

import { Mark, mergeAttributes } from '@tiptap/core';
import { UploadCloud, X, FileImage, LoaderCircle, Underline } from 'lucide-react';
import { Dialog, Button, TextField, Text, Flex, TextArea, Tooltip } from '@radix-ui/themes'; // Usando componentes Radix

import { axiosForInterceptor } from '../../utils/axios';

import {
    Bold,
    Italic,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Image as ImageIcon
} from 'lucide-react';
import { IconButton, Select, Separator } from '@radix-ui/themes';

interface ImageUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImageUploaded: (url: string) => void;
}

// <●> ImageUploadModal
const ImageUploadModal = ({ isOpen, onClose, onImageUploaded }: ImageUploadModalProps) => {
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

    // HERE --- Lógica de Upload de Imagem para o content ---
    const handleUpload = async () => {

        if (!file) return;
        setIsUploading(true);

        const formData = new FormData();
        formData.append('imagem', file); // 'imagem' deve ser o mesmo nome do campo no seu modelo Django

        try {
            const response = await axiosForInterceptor.post('/postagens-content/upload-image/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const imageUrl = response.data.imagem;
            console.log('Upload concluído. URL:', imageUrl);

            // Enviar a URL real de volta para o editor
            onImageUploaded(imageUrl);
            closeAndReset(); // Fecha e reseta a modal

        } catch (err) {
            console.error('Falha no upload da imagem:', err);
            // Idealmente, extraia a mensagem de erro da resposta da API
            setError('Ocorreu um erro ao enviar a imagem. Tente novamente.');
        } finally {
            setIsUploading(false);
        }

    };  // . . . 

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

// <●> TextClass
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


// <●> Toolbar
const Toolbar = ({ editor }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    if (!editor) return null;
    const handleImageInsert = (url) => { if (url) { editor.chain().focus().setImage({ src: url }).run(); } };
    const FONT_OPTIONS = [
        { label: 'Pequeno', value: 'text-small' },
        { label: 'Grande', value: 'text-large' },
        { label: 'Subtítulo', value: 'text-subtitle' },
    ];
    const activeFontSize = FONT_OPTIONS.find(option => editor.isActive('textClass', { class: option.value }))?.value || 'normal';
    const handleFontSizeChange = (className) => {
        if (className === 'normal') { editor.chain().focus().unsetMark('textClass').run(); }
        else { editor.chain().focus().setTextClass(className).run(); }
    };

    return (
        <>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 p-2 bg-gray-50 border-b border-gray-200">

                <Tooltip content="Negrito">
                    <IconButton variant={editor.isActive('bold') ? 'soft' : 'ghost'} aria-label="Negrito" onClick={() => editor.chain().focus().toggleBold().run()}>
                        <Bold size={18} />
                    </IconButton>
                </Tooltip>
                <Tooltip content="Itálico">
                    <IconButton variant={editor.isActive('italic') ? 'soft' : 'ghost'} aria-label="Itálico" onClick={() => editor.chain().focus().toggleItalic().run()}>
                        <Italic size={18} />
                    </IconButton>
                </Tooltip>
                {/* --- NOVO: Botão de Sublinhado --- */}
                <Tooltip content="Sublinhado">
                    <IconButton variant={editor.isActive('underline') ? 'soft' : 'ghost'} aria-label="Sublinhado" onClick={() => editor.chain().focus().toggleUnderline().run()}>
                        <Underline size={18} />
                    </IconButton>
                </Tooltip>

                <Separator orientation="vertical" />

                <Select.Root value={activeFontSize} onValueChange={handleFontSizeChange}>
                    <Tooltip content="Tamanho do Texto">
                        <Select.Trigger variant="soft" placeholder="Tamanho do Texto" />
                    </Tooltip>
                    <Select.Content>
                        <Select.Group>
                            <Select.Label>Tamanho</Select.Label>
                            <Select.Item value="normal">Normal</Select.Item>
                            {FONT_OPTIONS.map(option => (<Select.Item key={option.value} value={option.value}>{option.label}</Select.Item>))}
                        </Select.Group>
                    </Select.Content>
                </Select.Root>

                <Separator orientation="vertical" />

                <Tooltip content="Alinhar à Esquerda"><IconButton variant={editor.isActive({ textAlign: 'left' }) ? 'soft' : 'ghost'} aria-label="Alinhar à Esquerda" onClick={() => editor.chain().focus().setTextAlign('left').run()}><AlignLeft size={18} /></IconButton></Tooltip>
                <Tooltip content="Centralizar"><IconButton variant={editor.isActive({ textAlign: 'center' }) ? 'soft' : 'ghost'} aria-label="Centralizar" onClick={() => editor.chain().focus().setTextAlign('center').run()}><AlignCenter size={18} /></IconButton></Tooltip>
                <Tooltip content="Alinhar à Direita"><IconButton variant={editor.isActive({ textAlign: 'right' }) ? 'soft' : 'ghost'} aria-label="Alinhar à Direita" onClick={() => editor.chain().focus().setTextAlign('right').run()}><AlignRight size={18} /></IconButton></Tooltip>
                <Tooltip content="Justificar"><IconButton variant={editor.isActive({ textAlign: 'justify' }) ? 'soft' : 'ghost'} aria-label="Justificar" onClick={() => editor.chain().focus().setTextAlign('justify').run()}><AlignJustify size={18} /></IconButton></Tooltip>

                <Separator orientation="vertical" />

                <Tooltip content="Adicionar Imagem ao Conteúdo">
                    <IconButton variant="ghost" color="gray" aria-label="Adicionar Imagem" onClick={() => setIsModalOpen(true)}>
                        <ImageIcon size={18} />
                    </IconButton>
                </Tooltip>
            </div>
            <ImageUploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onImageUploaded={handleImageInsert} />
        </>
    );
};

interface PostEditorDashboardProps {
    initialTitle?: string;
    initialContent?: string;
    initialResumo?: string;
    initialImagem?: string | null;
    onSave: (data: { title: string; content: string; resumo: string; imagem_destaque: File | null }) => void;
    onCancel: () => void;
}

const PostEditorDashboard = ({ // ★ PostEditorDashboard ── ◯⫘⫘⫘⫘⫘⫘⫘⫘⫘⫸
    initialTitle = '', initialResumo = '', initialContent = '', initialImagem = null, onSave, onCancel
}: PostEditorDashboardProps) => {

    const [postTitle, setPostTitle] = useState(initialTitle);
    const [postContent, setPostContent] = useState(initialContent);
    const [resumo, setResumo] = useState(initialResumo);

    const [imagemFile, setImagemFile] = useState<File | null>(null);
    const [imagemPreview, setImagemPreview] = useState<string | null>(initialImagem);

    const fileInputRef = React.useRef<HTMLInputElement>(null);


    const editor = useEditor({
        extensions: [
            StarterKit.configure({ heading: { levels: [2, 3] } }),
            Image,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            TextClass,
            UnderlineExtension, // <--- NOVO: Ativando a extensão de sublinhado

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


    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImagemFile(file);
            setImagemPreview(URL.createObjectURL(file));
        }
    };



    const handleFeaturedImageClick = () => {
        fileInputRef.current?.click();
    };



    useEffect(() => {
        if (editor && initialContent !== editor.getHTML()) {
            editor.commands.setContent(initialContent, false);
            setPostTitle(initialTitle); // Sincroniza o título também
        }
    }, [initialContent, initialTitle, editor]);



    const handleSaveClick = () => {
        onSave({ title: postTitle, content: postContent, resumo: resumo, imagem_destaque: imagemFile });
    };



    return ( // ── ◯─◡◠◡◠◡◠ DOM ◡◠◡◠◡◠◡◠─➤

        <div className="border border-gray-300 rounded-lg shadow-sm">
            <div className="p-4 bg-gray-50">

                <Flex direction="column" gap="3">

                    <label>
                        <Text as="div" size="2" mb="1" weight="bold">Título da Postagem</Text>
                        <TextField.Root
                            size="3"
                            value={postTitle}
                            onChange={(e) => setPostTitle(e.target.value)}
                            placeholder="Título do Post"
                        />
                    </label>

                    <label>
                        <Text as="div" size="2" mb="1" weight="bold">Resumo (Chamada)</Text>
                        <TextArea value={resumo} onChange={(e) => setResumo(e.target.value)} placeholder="Uma ou duas frases que aparecerão nos cards do blog." />
                    </label>


                    <div>
                        <Text as="div" size="2" mb="1" weight="bold">Imagem de Destaque</Text>

                        <Button
                            variant="soft"
                            color="gray"
                            onClick={handleFeaturedImageClick} // Chama a função que dispara o clique
                        >
                            <UploadCloud size={16} style={{ marginRight: '8px' }} />
                            {imagemFile ? 'Trocar Imagem' : 'Selecionar Imagem'}
                        </Button>

                        <input
                            ref={fileInputRef} // Anexa a referência
                            type="file"
                            className="hidden" // Mantém o input original escondido
                            accept="image/png, image/jpeg"
                            onChange={handleFileSelect}
                        />

                        {imagemPreview && <img src={imagemPreview} alt="Preview" className="mt-2 w-48 h-auto rounded" />}
                    </div>


                </Flex>

            </div>
            <div className='border-y border-gray-200'>

                <Toolbar // <○> Toolbar
                    editor={editor} />

                <EditorContent // <○> EditorContent
                    editor={editor} />
            </div>

            <div className="flex justify-end gap-3 p-4 bg-gray-50">
                <Button variant="soft" color="gray" onClick={onCancel}>Cancelar</Button>
                <Button onClick={handleSaveClick}>Salvar Postagem</Button>
            </div>
        </div>
    );
}; // ★ PostEditorDashboard ── ◯⫘⫘⫘⫘⫘⫘⫘⫘⫘⫸

export default PostEditorDashboard;
























