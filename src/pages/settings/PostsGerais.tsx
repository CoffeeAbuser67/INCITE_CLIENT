// src/pages/settings/GerenciamentoPostsGerais.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Heading, Button, Flex, Card, Text, Spinner } from '@radix-ui/themes';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';


import PostEditorDashboard from './PostEditor';
import { axiosForInterceptor } from '../../utils/axios';

import { toast } from 'react-toastify';
import handleAxiosError from '../../utils/handleAxiosError';


export const GerenciamentoPostsGerais = () => {
    const [posts, setPosts] = useState<Postagem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [mode, setMode] = useState<'list' | 'editor'>('list');
    const [postAlvo, setPostAlvo] = useState<Partial<Postagem> | null>(null);

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

    const handleSave = async (dados: { title: string; content: string }) => {
        // Para posts gerais, o payload NÃO tem `instituicaoId`
        const payload = { ...dados, instituicao: null };
        try {
            if (postAlvo && 'id' in postAlvo) {
                await axiosForInterceptor.put(`/postagens/${postAlvo.id}/`, payload);
                toast.success('Postagem geral atualizada!');
            } else {
                await axiosForInterceptor.post('/postagens/', payload);
                toast.success('Postagem geral criada!');
            }
            setMode('list');
            fetchPostsGerais(); // Recarrega a lista
        } catch (error) {
            handleAxiosError(error);
        }
    };

    // TODO: Adicionar a lógica de exclusão com AlertDialog

    if (mode === 'editor') {
        return (
            <PostEditorDashboard
                initialTitle={postAlvo?.title}
                initialContent={postAlvo?.content || ''}
                onSave={handleSave}
                onCancel={() => setMode('list')}
            />
        );
    }

    return (
        <Card>
            <Flex justify="between" align="center" mb="4">
                <Heading>Postagens Gerais do Site</Heading>

                <Button onClick={() => { setPostAlvo(null); setMode('editor'); }}>
                    
                    <PlusCircle size={16} /> Novo Post Geral
                    
                </Button>

            </Flex>
            {isLoading ? <Spinner /> : (
                <div className="grid gap-4">
                    {posts.map((post: Postagem) => (
                        <Card key={post.id}>
                            <Flex justify="between" align="center">
                                <div>
                                    <Text weight="bold">{post.title}</Text>
                                    <Text as="p" size="2" color="gray">Criado em: {new Date(post.created_at).toLocaleDateString('pt-BR')}</Text>
                                </div>
                                <Flex gap="3">
                                    <Button variant="soft" onClick={() => { setPostAlvo(post); setMode('editor'); }}>
                                        <Pencil size={16} />
                                    </Button>
                                    <Button color="red" variant="soft" onClick={() => alert('Implementar exclusão')}>
                                        <Trash2 size={16} />
                                    </Button>
                                </Flex>
                            </Flex>
                        </Card>
                    ))}
                </div>
            )}
        </Card>
    );
};