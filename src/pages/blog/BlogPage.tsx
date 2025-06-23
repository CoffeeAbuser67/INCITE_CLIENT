// src/pages/BlogPage.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { Heading, Grid, Box, Flex, Text, Button, Spinner, Card, AspectRatio } from '@radix-ui/themes';
import { axiosPlain } from '../../utils/axios';
import { PostCard } from './PostCard';
import { PublicPost, InstituicaoParaFiltro } from './blogTypes';
import { Link } from 'react-router-dom';

const BlogPage = () => {
    const [posts, setPosts] = useState<PublicPost[]>([]);
    const [instituicoes, setInstituicoes] = useState<InstituicaoParaFiltro[]>([]);
    const [filtroInstituicao, setFiltroInstituicao] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [postsResponse, instituicoesResponse] = await Promise.all([
                    axiosPlain.get('/blog/posts/'), // Seu novo endpoint público
                    axiosPlain.get('/map-markers/') // Endpoint leve para os nomes das instituições
                ]);
                setPosts(postsResponse.data);
                setInstituicoes(instituicoesResponse.data);
            } catch (error) {
                console.error("Falha ao carregar dados do blog:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const postsFiltrados = useMemo(() => {
        if (!filtroInstituicao) return posts;
        return posts.filter(p => p.instituicao_nome === filtroInstituicao);
    }, [posts, filtroInstituicao]);

    const postDestaque = postsFiltrados[0];
    const outrosPosts = postsFiltrados.slice(1);

    if (isLoading) {
        return <Flex justify="center" align="center" className="h-96"><Spinner size="3" /></Flex>;
    }

    return (
        <div className="mt-40 p-4 sm:p-8 max-w-7xl mx-auto">
            <Heading size="9" mb="8" align="center" className="text-gray-800">Blog & Notícias</Heading>

            {postDestaque && (
                <Link to={`/blog/${postDestaque.id}`} className="no-underline text-current">
                    <Card size="5" mb="8" className="group overflow-hidden">
                        <Flex direction={{ initial: 'column', md: 'row' }} gap="6" align="center">
                            <Box className="w-full md:w-3/5">
                                <AspectRatio ratio={16 / 9}>
                                    <img src={postDestaque.imagem_destaque || '...'} alt={postDestaque.title} className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300" />
                                </AspectRatio>
                            </Box>
                            <Box className="w-full md:w-2/5">
                                <Text size="2" color="jade" weight="bold" mb="2">{postDestaque.instituicao_nome || 'IN-CITE AF'}</Text>
                                <Heading as="h2" size={{ initial: '6', md: '8' }} mt="1">{postDestaque.title}</Heading>
                                <Text as="p" size="3" color="gray" mt="3">{postDestaque.resumo}</Text>
                            </Box>
                        </Flex>
                    </Card>
                </Link>
            )}

            <Flex gap={{ initial: '6', md: '8' }} direction={{ initial: 'column-reverse', md: 'row' }}>
                <Grid columns={{ initial: '1', sm: '2', md: '3' }} gap="6" className="flex-1">
                    {outrosPosts.map(post => <PostCard key={post.id} post={post} />)}
                </Grid>

                <Box width={{ initial: '100%', md: '280px' }}>
                    <Heading size="4" mb="4">Filtrar por Instituição</Heading>
                    <Flex direction="column" gap="2" align="stretch">
                        <Button size="2" variant={!filtroInstituicao ? 'solid' : 'soft'} onClick={() => setFiltroInstituicao(null)}>
                            Ver Todas
                        </Button>
                        {instituicoes.map((inst: InstituicaoParaFiltro) => (
                            <Button key={inst.id} size="2" variant={filtroInstituicao === inst.nome ? 'solid' : 'soft'} onClick={() => setFiltroInstituicao(inst.nome)}>
                                {inst.nome}
                            </Button>
                        ))}
                    </Flex>
                </Box>
            </Flex>
        </div>
    );
};

export default BlogPage