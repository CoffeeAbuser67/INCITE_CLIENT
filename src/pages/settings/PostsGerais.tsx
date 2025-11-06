// src/pages/settings/GerenciamentoPostsGerais.tsx
import { useState, useEffect, useCallback } from 'react';
import { Heading, Button, Flex, Card, Text, Spinner, AlertDialog, AspectRatio, Box } from '@radix-ui/themes';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import PostEditorDashboard from './PostEditor';
import { axiosForInterceptor } from '../../utils/axios';
import { toast } from 'react-toastify';
import handleAxiosError from '../../utils/handleAxiosError';
import { Postagem } from './Instituicao';


export const GerenciamentoPostsGerais = () => { // ★ GerenciamentoPostsGerais ◠◡◠◡◠◡◠◡◠─➤

    const [posts, setPosts] = useState<Postagem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [mode, setMode] = useState<'list' | 'editor'>('list');
    const [postAlvo, setPostAlvo] = useState<Partial<Postagem> | null>(null);
    const [postParaExcluir, setPostParaExcluir] = useState<Postagem | null>(null);

    const mostrarFormCriacao = () => {
        setPostAlvo({ title: '', resumo: '', content: '', imagem_destaque: null });
        setMode('editor');
    };

    // Função para buscar os posts GERAIS da axiosForInterceptor
    const fetchPostsGerais = useCallback(async () => {
        setIsLoading(true);
        try {
            // Usamos o novo filtro que criamos no backend
            const response = await axiosForInterceptor.get('/postagens/?tipo=geral');
            setPosts(response.data);
        } catch (error) {
            handleAxiosError(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPostsGerais();
    }, [fetchPostsGerais]);

    const handleSave = async (dados: { title: string, resumo: string, imagem_destaque: File | null, content: string }) => {
        // Para posts gerais, o payload NÃO tem `instituicaoId`
        const formData = new FormData();
        formData.append('title', dados.title);
        formData.append('content', dados.content);
        formData.append('resumo', dados.resumo || '');

        if (dados.imagem_destaque) {
            formData.append('imagem_destaque', dados.imagem_destaque);
        }
        try {
            if (postAlvo && 'id' in postAlvo) {
                await axiosForInterceptor.put(`/postagens/${postAlvo.id}/`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                toast.success('Postagem geral atualizada!');
            } else {
                await axiosForInterceptor.post('/postagens/', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Postagem geral criada!');
            }
            setMode('list');
            fetchPostsGerais(); // Recarrega a lista
        } catch (error) {
            handleAxiosError(error);
        }
    };


    const handleConfirmarExclusaoPost = async () => {
        if (!postParaExcluir) return;

        try {
            await axiosForInterceptor.delete(`/postagens/${postParaExcluir.id}/`);
            toast.success(`Postagem "${postParaExcluir.title}" excluída com sucesso!`);
            // Recarrega a lista 
            fetchPostsGerais();
        } catch (err) {
            console.error("Erro ao excluir postagem:", err);
            toast.warn("Ocorreu um erro ao excluir a postagem.");
        } finally {
            // Fecha a modal
            setPostParaExcluir(null);
        }
    };



    if (mode === 'editor') {
        return (
            <PostEditorDashboard
                initialTitle={postAlvo?.title}
                initialResumo={postAlvo?.resumo || ''}
                initialContent={postAlvo?.content || ''}
                initialImagem={postAlvo?.imagem_destaque || ''}
                onSave={handleSave}
                onCancel={() => setMode('list')}
            />
        );
    }


    return ( // ── ⋙⇌⇌⇌⇌⇌⇌⇌ DOM ⇌⇌⇌⇌⇌⇌⇌⇌⫸
        <Card>

            <Flex justify="between" align="center" mb="4">
                <Heading>Postagens Gerais do Site</Heading>
                <Button size={{ initial: '2', sm: '3' }} onClick={mostrarFormCriacao}>
                    <PlusCircle className="h-5 w-5 sm:mr-2" />
                    <span className="hidden sm:inline">Novo Post Geral</span>
                </Button>
            </Flex>
            
            {isLoading ? (
                <Spinner />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {posts.map((post: Postagem) => (
                        <Card
                            key={post.id}
                            className="h-full flex flex-col"
                        >
                            <Box>
                                <AspectRatio ratio={16 / 9}>
                                    <img
                                        src={
                                            post.imagem_destaque ||
                                            'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800'
                                        }
                                        alt={`Imagem para ${post.title}`}
                                        className="w-full h-full object-cover rounded-md"
                                    />
                                </AspectRatio>
                            </Box>

                            <Box p="3" className="flex-grow flex flex-col justify-between">
                                <Heading as="h3" size="4" mt="2" truncate>
                                    {post.title}
                                </Heading>

                                {post.resumo && (
                                    <Text
                                        as="p"
                                        size="2"
                                        color="gray"
                                        mt="1"
                                        className="line-clamp-3 flex-grow"
                                    >
                                        {post.resumo}
                                    </Text>
                                )}

                                <Flex align="center" justify="between" mt="5">

                                    <Text color="gray" size="2">
                                        {new Date(post.created_at).toLocaleDateString('pt-BR')}
                                    </Text>

                                    <Flex gap="2">
                                        <Button
                                            className="cursor-pointer"
                                            size="1"
                                            variant="soft"
                                            onClick={() => {
                                                setPostAlvo(post);
                                                setMode('editor');
                                            }}
                                        >
                                            <Pencil size={16} />
                                        </Button>

                                        <Button
                                            className="cursor-pointer"
                                            size="1"
                                            color="red"
                                            variant="soft"
                                            onClick={() => setPostParaExcluir(post)}
                                        >

                                            <Trash2 size={16} />

                                        </Button>
                                    </Flex>
                                </Flex>

                            </Box>
                        </Card>
                    ))}
                </div>
            )}

            <AlertDialog.Root
                open={!!postParaExcluir}
                onOpenChange={() => setPostParaExcluir(null)}
            >
                <AlertDialog.Content style={{ maxWidth: 450 }}>
                    <AlertDialog.Title>Confirmar Exclusão</AlertDialog.Title>
                    <AlertDialog.Description size="2">
                        Você tem certeza que deseja excluir a postagem
                        <Text weight="bold"> "{postParaExcluir?.title}"</Text>?
                    </AlertDialog.Description>
                    <Flex gap="3" mt="4" justify="end">
                        <AlertDialog.Cancel>
                            <Button variant="soft" color="gray">
                                Cancelar
                            </Button>
                        </AlertDialog.Cancel>
                        <AlertDialog.Action>
                            <Button
                                variant="solid"
                                color="red"
                                onClick={handleConfirmarExclusaoPost}
                            >
                                Sim, Excluir Postagem
                            </Button>
                        </AlertDialog.Action>
                    </Flex>
                </AlertDialog.Content>
            </AlertDialog.Root>
        </Card>
    );


}; // ★ GerenciamentoPostsGerais ◠◡◠◡◠◡◠◡◠─➤