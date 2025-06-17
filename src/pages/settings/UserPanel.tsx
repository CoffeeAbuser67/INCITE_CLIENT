// src/pages/settings/GerenciamentoUsuarios.tsx

import React, { useState, useEffect } from 'react';
import { useUserStore, User } from '../../store/userStore';

import { axiosForInterceptor } from '../../utils/axios';

import { Heading, Text, Card, Flex, Button, Spinner } from '@radix-ui/themes';
// Importe seus componentes de formulário aqui (vamos criá-los)

// import { NovoUsuarioForm } from './NovoUsuarioForm';
import { ChangePasswordForm } from './ChangePasswordForm';


const AdminUserView = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axiosForInterceptor.get('/users/');
                setUsers(response.data);
            } catch (error) {
                console.error("Erro ao buscar usuários", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, []);

    if (isLoading) return <Spinner />;

    return (
        <div>
            <Flex justify="between" align="center" mb="4">
                <Heading size="5">Todos os Usuários do Sistema</Heading>
                {/* TODO: Botão para abrir modal de criação de usuário */}
                <Button>+ Novo Usuário</Button>
            </Flex>
            <div className="grid gap-4">
                {users.map(user => (
                    <Card key={user.pkid}>
                        <Text weight="bold">{user.first_name} {user.last_name}</Text>
                        <Text as="p" color="gray">{user.email}</Text>
                        {/* TODO: Botões de editar/deletar */}
                    </Card>
                ))}
            </div>
        </div>
    );
};



const BasicUserView = () => {
    const { user } = useUserStore();

    return (
        <div>
            <Heading size="5" mb="2">Meu Perfil</Heading>
            <Card>
                <Text weight="bold">Nome:</Text> {user?.first_name} {user?.last_name}<br/>
                <Text weight="bold">Email:</Text> {user?.email}
            </Card>
            
            <Heading size="5" mt="6" mb="2">Segurança</Heading>
            <Card>
                {/* Aqui entrará o formulário para mudar a própria senha */}
                <ChangePasswordForm />
            </Card>
        </div>
    );
};

// --- Componente Principal ---
export const UserPanel = () => {
    const { user } = useUserStore();

    // O valor 67 é o que você definiu para Admin/Master no seu modelo
    const isAdmin = user?.user_group === 67;

    return (
        <div>
            <Heading as="h1" size="8" mb="6">Gerenciamento de Usuários</Heading>
            {isAdmin ? <AdminUserView /> : <BasicUserView />}
        </div>
    );
};

