// src/pages/BlogPage.tsx

import React, { useState, useEffect, useMemo } from 'react';
// [NOVO] Importe o Separator do Radix UI
import { Heading, Grid, Box, Flex, Text, Spinner, Card, AspectRatio, Select, Separator } from '@radix-ui/themes';
import { axiosPlain } from '../../utils/axios';
import { PostCard } from './PostCard';
import { PublicPost, InstituicaoParaFiltro } from './blogTypes';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

const BlogPage = () => {
    const [posts, setPosts] = useState<PublicPost[]>([]);
    const [instituicoes, setInstituicoes] = useState<InstituicaoParaFiltro[]>([]);
    const [filtroInstituicao, setFiltroInstituicao] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [postsResponse, instituicoesResponse] = await Promise.all([
                    axiosPlain.get('/blog/posts/'),
                    axiosPlain.get('/map-markers/')
                ]);

                console.log(' ⋙⇌⇌⇌⇌⇌⇌⇌⇌⇌⇌⇌⇌⇌⇌⇌⫸');
                console.log('postsResponse:', postsResponse.data);

                // [MODIFICADO] Garante que os posts sem instituição venham primeiro,
                // mesmo que a API mude a ordenação padrão no futuro.

                const sortedPosts = [...postsResponse.data].sort((a, b) => {
                    if (a.instituicao_nome === null && b.instituicao_nome !== null) return -1;
                    if (a.instituicao_nome !== null && b.instituicao_nome === null) return 1;
                    // Para posts do mesmo "grupo", mantém a ordem original (mais recente primeiro)
                    return 0;
                });

                setPosts(sortedPosts);
                setInstituicoes(instituicoesResponse.data);

            } catch (error) {
                console.error("Falha ao carregar dados do blog:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const instituicaoSelecionada = useMemo(() =>
        filtroInstituicao ? instituicoes.find(inst => inst.nome === filtroInstituicao) : null,
        [instituicoes, filtroInstituicao]);



    // [MODIFICADO] Lógica de filtro e separação foi centralizada aqui.
    const { postsParaExibir, indiceSeparador } = useMemo(() => {
        // Se um filtro de instituição está ativo, funciona como antes.
        if (filtroInstituicao) {
            return {
                postsParaExibir: posts.filter(p => p.instituicao_nome === filtroInstituicao),
                indiceSeparador: -1 // -1 significa que não há separador
            };
        }

        // Se o filtro for "all" (null)
        const postsSemInstituicao = posts.filter(p => p.instituicao_nome === null);
        const postsComInstituicao = posts.filter(p => p.instituicao_nome !== null);

        // O separador só deve aparecer se ambos os grupos tiverem posts
        const deveSeparar = postsSemInstituicao.length > 0 && postsComInstituicao.length > 0;

        return {
            postsParaExibir: [...postsSemInstituicao, ...postsComInstituicao],
            // O índice do separador é a quantidade de posts no primeiro grupo.
            // Ele virá ANTES do primeiro item do segundo grupo.
            indiceSeparador: deveSeparar ? postsSemInstituicao.length : -1
        };
    }, [posts, filtroInstituicao]);



    // A lógica de destaque continua funcionando, agora com a lista já ordenada.
    const postDestaque = postsParaExibir[0];
    const outrosPosts = postsParaExibir.slice(1);

    if (isLoading) {
        return <Flex justify="center" align="center" className="h-96"><Spinner size="3" /></Flex>;
    }

    return (
        <div className="p-4 sm:p-8 max-w-7xl mx-auto">
            <Heading size="9" mt="4" mb="8" align="center" className="text-gray-800">Notícias</Heading>

            {postDestaque && (
                <Link to={`/blog/${postDestaque.id}`} className="no-underline text-current">
                    <Card size="5" mb="8" className="group overflow-hidden">
                        <Flex direction={{ initial: 'column', md: 'row' }} gap="6" align="center">
                            <Box className="w-full md:w-3/5">
                                <AspectRatio ratio={16 / 9}>
                                    <img src={postDestaque.imagem_destaque || '...'} alt={postDestaque.title} className="w-full h-full object-contain rounded-xl group-hover:scale-105 transition-transform duration-300" />
                                </AspectRatio>
                            </Box>
                            <Box className="w-full md:w-2/5">
                                <Text size="2" color="jade" weight="bold" mb="2">{postDestaque.instituicao_nome || 'INCITE AF'}</Text>
                                <Heading as="h2" size={{ initial: '6', md: '8' }} mt="1">{postDestaque.title}</Heading>
                                <Text as="p" size="3" color="gray" mt="3">{postDestaque.resumo}</Text>
                            </Box>
                        </Flex>
                    </Card>
                </Link>
            )}

            <Flex gap={{ initial: '6', md: '8' }} direction={{ initial: 'column-reverse', md: 'row' }}>
                <Grid columns={{ initial: '1', sm: '2', md: '3' }} gap="6" className="flex-1">
                    {/* [MODIFICADO] Lógica de renderização do grid para incluir o separador */}
                    {outrosPosts.map((post, index) => {
                        // O índice do post na lista original `postsParaExibir` é `index + 1`,
                        // pois `outrosPosts` não inclui o primeiro item (destaque).
                        const indiceOriginal = index + 1;

                        // Verificamos se o índice atual corresponde ao ponto onde o separador deve entrar.
                        const deveRenderizarSeparador = indiceOriginal === indiceSeparador;

                        return (
                            <React.Fragment key={post.id}>
                                {deveRenderizarSeparador && (
                                    // Separador customizado

                                    <Box className="col-span-1 sm:col-span-2 md:col-span-3 my-4">
                                        <Flex direction="column" gap="3" align="center">

                                            <Separator color = "jade" size="4" style={{height: "2px", width: '80%' }} />

                                        </Flex>
                                    </Box>
                                )}
                                <PostCard post={post} />
                            </React.Fragment>
                        );
                    })}
                </Grid>

                <Box width={{ initial: '100%', md: 'w-1/3' }} className="sticky top-24 self-start">
                    <Heading size="4" mb="4">Explorar por Instituição</Heading>
                    <Select.Root
                        size="3"
                        value={filtroInstituicao || 'all'}
                        onValueChange={(value) => {
                            setFiltroInstituicao(value === 'all' ? null : value);
                        }}
                    >
                        <Select.Trigger variant="soft" placeholder="Selecione uma instituição..." />
                        <Select.Content variant="soft" position="popper">
                            <Select.Group>
                                <Select.Label>Instituições</Select.Label>
                                <Select.Item value="all">Todas as Postagens</Select.Item>
                                {instituicoes.map((inst) => (
                                    <Select.Item key={inst.id} value={inst.nome}>
                                        <Text size="2">{inst.nome}</Text>
                                    </Select.Item>
                                ))}
                            </Select.Group>
                        </Select.Content>
                    </Select.Root>

                    {instituicaoSelecionada && (
                        <Card variant="ghost" mt="5">
                            {instituicaoSelecionada.marcador_logo && (
                                <Link to={`/instituicao/${instituicaoSelecionada.id}`}>
                                    <img
                                        src={instituicaoSelecionada.marcador_logo}
                                        alt={`${instituicaoSelecionada.nome} logo`}
                                        className=" w-[130px] h-auto rounded cursor-pointer transition-transform duration-200 hover:scale-105"
                                    />
                                </Link>
                            )}
                        </Card>
                    )}
                </Box>
            </Flex>
        </div>
    );
};

export default BlogPage;