// src/pages/InstituicaoProfilePage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heading, Box, Text, Flex, Spinner, Card, Avatar, Badge, Tabs } from '@radix-ui/themes';


import { axiosPlain } from '../../utils/axios';
import { MapPin, Mail, Phone, Users, FlaskConical, Newspaper } from 'lucide-react';

// Componentes internos para cada aba, para manter o código limpo


const SobreTab = ({ instituicao }) => (
    <Card>
        <Heading size="4" mb="2">Sobre a Instituição</Heading>
        <Text as="p" color="gray">{instituicao.informacoes_adicionais || 'Nenhuma informação adicional fornecida.'}</Text>
    </Card>
);


const PesquisadoresList = ({ pesquisadores }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {pesquisadores.map(p => (
            <Card key={p.id}>
                <Flex gap="3" align="center">
                    <Avatar fallback={p.nome.charAt(0)} size="3" radius="full" />
                    <Box>
                        <Text as="div" weight="bold">{p.nome}</Text>
                        <Text as="div" size="2" color="gray">{p.area_atuacao}</Text>
                        {p.bolsista && <Badge color="green" mt="1">Bolsista</Badge>}
                    </Box>
                </Flex>
            </Card>
        ))}
    </div>
);


// TODO: Crie componentes similares para Pesquisas, AcoesExtensionistas, e Produtos

const InstituicaoProfilePage = () => {
    const { id } = useParams<{ id: string }>();
    const [instituicao, setInstituicao] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchInstituicao = async () => {
            setIsLoading(true);
            try {
                // Usamos o endpoint de detalhes que já existe!
                const response = await axiosPlain.get(`/profile/instituicoes/${id}/`);
                setInstituicao(response.data);
            } catch (error) {
                console.error("Falha ao carregar instituição:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchInstituicao();
    }, [id]);

    if (isLoading) {
        return <Flex justify="center" align="center" className="h-96"><Spinner size="3" /></Flex>;
    }

    if (!instituicao) {
        return <div className="text-center p-8">Instituição não encontrada.</div>;
    }

    return (
        <div className="mt-32 max-w-5xl mx-auto p-4 sm:p-8">
     

            <Flex gap="5" align="center" mb="6">
                <Avatar
                    src={instituicao.marcador_logo}
                    fallback={instituicao.nome.charAt(0)}
                    size="8"
                    radius="full"
                />

                <Box>
                    <Heading size={{ initial: '7', md: '8' }}>{instituicao.nome}</Heading>
                    <Flex align="center" gap="4" mt="2" wrap="wrap">
                        <Flex align="center" gap="2"><MapPin size={16} /><Text size="2">{instituicao.cidade_id_mapa.replace('_', ' ').toLocaleUpperCase()}</Text></Flex>
                        <Flex align="center" gap="2"><Users size={16} /><Text size="2">{instituicao.coordenador_responsavel}</Text></Flex>
                        <Flex align="center" gap="2"><Mail size={16} /><Text size="2">{instituicao.email}</Text></Flex>
                    </Flex>
                </Box>

            </Flex>


            {/* Conteúdo em Abas */}
            <Tabs.Root defaultValue="sobre">

                <Tabs.List>
                    <Tabs.Trigger value="sobre">Sobre</Tabs.Trigger>
                    <Tabs.Trigger value="pesquisadores">Pesquisadores ({instituicao.pesquisadores.length})</Tabs.Trigger>
                    <Tabs.Trigger value="pesquisas">Pesquisas ({instituicao.pesquisas.length})</Tabs.Trigger>
                    <Tabs.Trigger value="postagens">Notícias ({instituicao.postagens.length})</Tabs.Trigger>
                    {/* ... outras abas */}
                </Tabs.List>


                <Box pt="6">
                    <Tabs.Content value="sobre"><SobreTab instituicao={instituicao} /></Tabs.Content>
                    <Tabs.Content value="pesquisadores"><PesquisadoresList pesquisadores={instituicao.pesquisadores || []} /></Tabs.Content>
                    <Tabs.Content value="pesquisas"><Text>Conteúdo da aba de pesquisas...</Text></Tabs.Content>
                    <Tabs.Content value="postagens"><Text>Conteúdo da aba de notícias...</Text></Tabs.Content>
                </Box>

            </Tabs.Root>
        </div>
    );
};

export default InstituicaoProfilePage