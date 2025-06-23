// src/pages/PostDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heading, Box, Text, Flex, Spinner, AspectRatio, Button } from '@radix-ui/themes';
import { axiosPlain } from '../../utils/axios';
import { PublicPost } from './blogTypes';
import { ArrowLeft } from 'lucide-react';

export const PostDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [post, setPost] = useState<PublicPost | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            setIsLoading(true);
            try {
                // Usamos o endpoint público para buscar um post específico
                const response = await axiosPlain.get(`/blog/posts/${id}/`);
                setPost(response.data);
            } catch (error) {
                console.error("Falha ao carregar o post:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    if (isLoading) {
        return <Flex justify="center" align="center" className="h-96"><Spinner size="3" /></Flex>;
    }

    if (!post) {
        return <div className="text-center p-8">Post não encontrado.</div>;
    }

    return (
        <article className="max-w-4xl mx-auto p-4 sm:p-8">
            <Button variant="soft" asChild mb="6">
                <Link to="/blog"><ArrowLeft className="mr-2 h-4 w-4" /> Voltar para o Blog</Link>
            </Button>
            <Heading as="h1" size={{ initial: '8', md: '9' }} mb="4">{post.title}</Heading>
            <Flex align="center" gap="3" mb="6">
                <Text size="3" weight="bold" color="jade">{post.instituicao_nome || 'IN-CITE AF'}</Text>
                <Text color="gray">·</Text>
                <Text size="3" color="gray">{new Date(post.created_at).toLocaleDateString('pt-BR', { dateStyle: 'long' })}</Text>
            </Flex>

            {post.imagem_destaque && (
                <AspectRatio ratio={16 / 9} className="mb-8">
                    <img src={post.imagem_destaque} alt={post.title} className="w-full h-full object-cover rounded-xl shadow-lg" />
                </AspectRatio>
            )}

            {/* Renderiza o conteúdo HTML do Tiptap.
                É seguro pois este HTML é gerado por nós mesmos no painel admin. */}
            <Box className="prose lg:prose-xl max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>
    );
};

export default PostDetailPage