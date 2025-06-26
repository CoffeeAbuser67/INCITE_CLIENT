// src/pages/InstituicaoProfilePage.tsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heading, Box, Text, Flex, Spinner, Card, Avatar, Badge, Tabs, Button } from '@radix-ui/themes';
import { axiosPlain } from '../../utils/axios';
import { MapPin, Mail, Phone, Newspaper, User as UserIcon } from 'lucide-react';
import { Instituicao } from '../settings/Instituicao';





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





const InstituicaoProfilePage = () => {
    const { id } = useParams<{ id: string }>();
    const [instituicao, setInstituicao] = useState<Instituicao|null>(null);
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

        <div className="max-w-5xl mx-auto p-4 sm:p-8">

            <Flex gap="5" align="center" mb="6">
                <Avatar
                    src={instituicao.marcador_logo ?? undefined}
                    fallback={instituicao.nome.charAt(0)}
                    size="8"
                    radius="full"
                />

                <Box>
                    <Heading size={{ initial: '7', md: '8' }}>{instituicao.nome}</Heading>
                    <Flex align="center" gap="4" mt="2" wrap="wrap">
                        <Flex align="center" gap="2"><MapPin size={16} /><Text size="2">{instituicao.cidade_nome.toLocaleUpperCase()}</Text></Flex>
                        <Flex align="center" gap="2"><UserIcon size={16} /><Text size="2">{instituicao.coordenador_responsavel}</Text></Flex>
                        <Flex align="center" gap="2"><Mail size={16} /><Text size="2">{instituicao.email}</Text></Flex>
                        <Flex align="center" gap="2"><Phone size={16} /><Text size="2">{instituicao.telefone}</Text></Flex>
                    </Flex>
                </Box>
            </Flex>

            <Button variant="soft" asChild size="2" className='my-4 text-black'>
                <Link to={`/blog/${instituicao.id}`}>
                    <Newspaper size="18" className="mr-1" /> Notícias
                </Link>
            </Button>

            <Tabs.Root defaultValue="sobre">
                <Tabs.List>
                    <Tabs.Trigger value="sobre">Sobre</Tabs.Trigger>
                    <Tabs.Trigger value="pesquisadores">Pesquisadores ({instituicao.pesquisadores.length})</Tabs.Trigger>
                    <Tabs.Trigger value="pesquisas">Pesquisas ({instituicao.pesquisas.length})</Tabs.Trigger>
                </Tabs.List>


                <Box pt="6">
                    <Tabs.Content value="sobre"><SobreTab instituicao={instituicao} /></Tabs.Content>
                    <Tabs.Content value="pesquisadores"><PesquisadoresList pesquisadores={instituicao.pesquisadores || []} /></Tabs.Content>
                    <Tabs.Content value="pesquisas"><Text>Conteúdo da aba de pesquisas...</Text></Tabs.Content>
                </Box>

            </Tabs.Root>


        </div>
    );
};

export default InstituicaoProfilePage