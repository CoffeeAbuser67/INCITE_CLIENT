/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import UnderlineExtension from '@tiptap/extension-underline';
import { Mark, mergeAttributes, CommandProps } from '@tiptap/core';
import { UploadCloud, X, FileText, LoaderCircle, Underline } from 'lucide-react';
import { Button, TextField, Text, Flex, TextArea, Tooltip, Switch, Separator as RadixSeparator } from '@radix-ui/themes';
import {
    Bold,
    Italic,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
} from 'lucide-react';
import { IconButton, Select, Separator } from '@radix-ui/themes';

export type AnexoExistente = { id: number; arquivo: string; nome_original: string };

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
                    ({ commands }: CommandProps) => {
                        if (!className) {
                            return commands.unsetMark(this.name);
                        }
                        return commands.setMark(this.name, { class: className });
                    },
        } as any;
    },
});

interface ToolbarProps {
    editor: Editor | null;
}

// <●> Toolbar
const Toolbar = ({ editor }: ToolbarProps) => {
    if (!editor) return null;

    const FONT_OPTIONS = [
        { label: 'Pequeno', value: 'text-small' },
        { label: 'Grande', value: 'text-large' },
        { label: 'Subtítulo', value: 'text-subtitle' },
    ];
    const activeFontSize = FONT_OPTIONS.find(option => editor.isActive('textClass', { class: option.value }))?.value || 'normal';
    const handleFontSizeChange = (className: string) => {
        if (className === 'normal') { editor.chain().focus().unsetMark('textClass').run(); }
        else { (editor.chain().focus() as any).setTextClass(className).run(); }
    };

    return (
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
        </div>
    );
};

export interface PostSaveData {
    title: string;
    content: string;
    resumo: string;
    publicado: boolean;
    imagem_destaque: File | null;
    novosAnexos: File[];
    anexosRemovidos: number[];
}

interface PostEditorDashboardProps {
    initialTitle?: string;
    initialContent?: string;
    initialResumo?: string;
    initialImagem?: string | null;
    initialPublicado?: boolean;
    anexosExistentes?: AnexoExistente[];
    isSaving?: boolean;
    onSave: (data: PostSaveData) => void;
    onCancel: () => void;
}

const MAX_PDF_MB = 10;

const PostEditorDashboard = ({ // ★ PostEditorDashboard ── ◯⫘⫘⫘⫘⫘⫘⫘⫘⫘⫸
    initialTitle = '', initialResumo = '', initialContent = '', initialImagem = null,
    initialPublicado = false, anexosExistentes = [], isSaving = false, onSave, onCancel
}: PostEditorDashboardProps) => {

    const [postTitle, setPostTitle] = useState(initialTitle);
    const [postContent, setPostContent] = useState(initialContent);
    const [resumo, setResumo] = useState(initialResumo);
    const [publicado, setPublicado] = useState(initialPublicado);

    const [imagemFile, setImagemFile] = useState<File | null>(null);
    const [imagemPreview, setImagemPreview] = useState<string | null>(initialImagem);

    const [novosAnexos, setNovosAnexos] = useState<File[]>([]);
    const [anexosRemovidos, setAnexosRemovidos] = useState<number[]>([]);
    const [anexoErro, setAnexoErro] = useState<string | null>(null);

    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const pdfInputRef = React.useRef<HTMLInputElement>(null);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({ heading: { levels: [2, 3] } }),
            // Extensão Image removida: imagem inline não é mais suportada.
            TextAlign.configure({
                types: ['heading', 'paragraph'],
                // Emite class="text-center" em vez de style="text-align:center".
                // O backend sanitiza com bleach e não permite `style`.
                alignments: ['left', 'center', 'right', 'justify'],
            }),
            TextClass,
            UnderlineExtension,
        ],
        content: initialContent,
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

    const handlePdfSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        const validos: File[] = [];
        for (const f of files) {
            if (f.type !== 'application/pdf') {
                setAnexoErro(`"${f.name}" não é um PDF.`);
                continue;
            }
            if (f.size > MAX_PDF_MB * 1024 * 1024) {
                setAnexoErro(`"${f.name}" passa de ${MAX_PDF_MB}MB.`);
                continue;
            }
            validos.push(f);
        }
        if (validos.length) {
            setAnexoErro(null);
            setNovosAnexos(prev => [...prev, ...validos]);
        }
        event.target.value = '';
    };

    useEffect(() => {
        if (editor && initialContent !== editor.getHTML()) {
            editor.commands.setContent(initialContent, false);
            setPostTitle(initialTitle);
        }
    }, [initialContent, initialTitle, editor]);

    const handleSaveClick = () => {
        onSave({
            title: postTitle,
            content: postContent,
            resumo,
            publicado,
            imagem_destaque: imagemFile,
            novosAnexos,
            anexosRemovidos,
        });
    };

    const anexosVisiveis = anexosExistentes.filter(a => !anexosRemovidos.includes(a.id));

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
                            onClick={handleFeaturedImageClick}
                        >
                            <UploadCloud size={16} style={{ marginRight: '8px' }} />
                            {imagemFile ? 'Trocar Imagem' : 'Selecionar Imagem'}
                        </Button>

                        <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            accept="image/png, image/jpeg"
                            onChange={handleFileSelect}
                        />

                        {imagemPreview && <img src={imagemPreview} alt="Preview" className="mt-2 w-48 h-auto rounded" />}
                    </div>

                    <RadixSeparator my="2" size="4" />

                    <div>
                        <Text as="div" size="2" mb="1" weight="bold">Anexos (PDF)</Text>

                        <Button variant="soft" color="gray" onClick={() => pdfInputRef.current?.click()}>
                            <UploadCloud size={16} style={{ marginRight: '8px' }} />
                            Adicionar PDF
                        </Button>

                        <input
                            ref={pdfInputRef}
                            type="file"
                            className="hidden"
                            accept="application/pdf"
                            multiple
                            onChange={handlePdfSelect}
                        />

                        {anexoErro && <Text as="p" size="1" color="red" mt="1">{anexoErro}</Text>}

                        <Flex direction="column" gap="1" mt="2">
                            {anexosVisiveis.map(a => (
                                <Flex key={a.id} align="center" justify="between" className="p-2 bg-gray-100 rounded">
                                    <Flex align="center" gap="2" className="truncate">
                                        <FileText size={16} />
                                        <Text size="2" className="truncate">{a.nome_original}</Text>
                                    </Flex>
                                    <IconButton size="1" variant="ghost" color="red"
                                        onClick={() => setAnexosRemovidos(prev => [...prev, a.id])}>
                                        <X size={14} />
                                    </IconButton>
                                </Flex>
                            ))}
                            {novosAnexos.map((f, i) => (
                                <Flex key={`novo-${i}`} align="center" justify="between" className="p-2 bg-blue-50 rounded">
                                    <Flex align="center" gap="2" className="truncate">
                                        <FileText size={16} />
                                        <Text size="2" className="truncate">{f.name}</Text>
                                        <Text size="1" color="gray">(novo)</Text>
                                    </Flex>
                                    <IconButton size="1" variant="ghost" color="red"
                                        onClick={() => setNovosAnexos(prev => prev.filter((_, idx) => idx !== i))}>
                                        <X size={14} />
                                    </IconButton>
                                </Flex>
                            ))}
                        </Flex>
                    </div>

                    <RadixSeparator my="2" size="4" />

                    <Text as="label" size="2">
                        <Flex gap="2" align="center">
                            <Switch checked={publicado} onCheckedChange={setPublicado} />
                            Publicar no blog
                        </Flex>
                    </Text>
                    <Text as="p" size="1" color="gray">
                        Posts não publicados ficam salvos como rascunho e não aparecem no blog público.
                    </Text>

                </Flex>

            </div>
            <div className='border-y border-gray-200'>

                <Toolbar editor={editor} />

                <EditorContent editor={editor} />
            </div>

            <div className="flex justify-end gap-3 p-4 bg-gray-50">
                <Button variant="soft" color="gray" onClick={onCancel} disabled={isSaving}>Cancelar</Button>
                <Button onClick={handleSaveClick} disabled={isSaving}>
                    {isSaving && <LoaderCircle className="animate-spin mr-2 h-4 w-4" />}
                    {isSaving ? 'Salvando...' : 'Salvar Postagem'}
                </Button>
            </div>
        </div>
    );
}; // ★ PostEditorDashboard ── ◯⫘⫘⫘⫘⫘⫘⫘⫘⫘⫸

export default PostEditorDashboard;