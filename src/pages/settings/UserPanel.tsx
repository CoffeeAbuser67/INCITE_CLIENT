// src/pages/settings/AdminUserView.tsx
import { useEffect, useState } from 'react';
import { useUserStore, User } from '../../store/userStore';
import { userService } from '../../hooks/useUserService';
import { Card, Heading, Text, Flex, Button, Table, Dialog, AlertDialog, Badge, TextField, Select } from '@radix-ui/themes';
import { PlusCircle, Trash2, User as UserIcon } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import handleAxiosError from '../../utils/handleAxiosError';



const AddUserForm = ({ onSave, onCancel }) => { // <✪> AddUserForm
    const formik = useFormik({


        initialValues: {
            first_name: '',
            last_name: '',
            email: '',
            password1: '',
            password2: '',
            user_group: 11
        },


        validationSchema: Yup.object({
            first_name: Yup.string()
                .min(2, 'O nome deve ter pelo menos 2 caracteres')
                .max(50, 'O nome pode ter no máximo 50 caracteres')
                .required('O nome é obrigatório'),

            last_name: Yup.string()
                .min(2, 'O sobrenome deve ter pelo menos 2 caracteres')
                .max(50, 'O sobrenome pode ter no máximo 50 caracteres')
                .required('O sobrenome é obrigatório'),

            email: Yup.string()
                .email('Insira um e-mail válido')
                .required('O e-mail é obrigatório'),

            password1: Yup.string()
                .min(8, 'A senha deve ter pelo menos 8 caracteres')
                .matches(/[A-Z]/, 'A senha deve conter ao menos uma letra maiúscula')
                .matches(/[a-z]/, 'A senha deve conter ao menos uma letra minúscula')
                .matches(/[0-9]/, 'A senha deve conter ao menos um número')
                .required('A senha é obrigatória'),

            password2: Yup.string()
                .oneOf([Yup.ref('password1')], 'As senhas devem coincidir')
                .required('Confirmação de senha obrigatória'),
        }),



        onSubmit: async (values, { setSubmitting }) => {

            console.log('── ⋙⇌⇌⇌⇌⇌⇌⇌⇌⇌⇌⇌⇌⇌⇌⇌⫸')
            console.log('values :', values)
            console.log('── ⋙⇌⇌⇌⇌⇌⇌⇌⇌⇌⇌⇌⇌⇌⇌⇌⫸')


            try {
                await userService.createUser(values);
                toast.success('Usuário criado com sucesso!');
                onSave(); // Notifica o pai para recarregar a lista
            } catch (err) {
                handleAxiosError(err);
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <Flex direction="column" gap="3">

                {/* Nome */}
                <label>
                    <Text>Nome</Text>
                    <TextField.Root
                        name="first_name"
                        value={formik.values.first_name}
                        onChange={formik.handleChange}
                    />
                    {formik.touched.first_name && formik.errors.first_name && (
                        <Text size={"1"} color="red">{formik.errors.first_name}</Text>
                    )}
                </label>

                {/* Sobrenome */}
                <label>
                    <Text>Sobrenome</Text>
                    <TextField.Root
                        name="last_name"
                        value={formik.values.last_name}
                        onChange={formik.handleChange}
                    />
                    {formik.touched.last_name && formik.errors.last_name && (
                        <Text size={"1"} color="red">{formik.errors.last_name}</Text>
                    )}
                </label>

                {/* Email */}
                <label>
                    <Text>Email</Text>
                    <TextField.Root
                        name="email"
                        type="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                    />
                    {formik.touched.email && formik.errors.email && (
                        <Text size={"1"} color="red">{formik.errors.email}</Text>
                    )}
                </label>

                {/* Senha */}
                <label>
                    <Text>Senha</Text>
                    <TextField.Root
                        name="password1"
                        type="password"
                        value={formik.values.password1}
                        onChange={formik.handleChange}
                    />
                    {formik.touched.password1 && formik.errors.password1 && (
                        <Text size={"1"} color="red">{formik.errors.password1}</Text>
                    )}
                </label>

                {/* Confirmar Senha */}
                <label>
                    <Text>Confirmar Senha</Text>
                    <TextField.Root
                        name="password2"
                        type="password"
                        value={formik.values.password2}
                        onChange={formik.handleChange}
                    />
                    {formik.touched.password2 && formik.errors.password2 && (
                        <Text size={"1"} color="red">{formik.errors.password2}</Text>
                    )}
                </label>

                {/* Grupo */}
                <label>
                    <Text>Grupo</Text>
                    <Select.Root
                        name="user_group"
                        value={formik.values.user_group.toString()}
                        onValueChange={(value) => formik.setFieldValue('user_group', Number(value))}
                    >
                        <Select.Trigger placeholder="Selecione um grupo..." />
                        <Select.Content>
                            <Select.Item value="11">Usuário Básico</Select.Item>
                            <Select.Item value="67">Administrador</Select.Item>
                        </Select.Content>
                    </Select.Root>
                    {formik.touched.user_group && formik.errors.user_group && (
                        <Text size={"1"} color="red">{formik.errors.user_group}</Text>
                    )}
                </label>

                {/* Botões */}
                <Flex gap="3" mt="4" justify="end">
                    <Button variant="soft" type="button" onClick={onCancel}>Cancelar</Button>
                    <Button type="submit" disabled={formik.isSubmitting}>Salvar</Button>
                </Flex>
            </Flex>
        </form>
    );
}; //  ── ⋙── ── ── ── ── ── ── ──➤


export const UserPanel = () => { // ★ UserPanel

    // ✳ { userList, setUserList } 
    const { userList, setUserList } = useUserStore();
    // ✳ [isLoading, setIsLoading]
    const [isLoading, setIsLoading] = useState(true);

    // ✳ [isAddModalOpen, setIsAddModalOpen] 
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    // ✳ [userToDelete, setUserToDelete]
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    const loadUsers = async () => {
        setIsLoading(true);
        try {
            await userService.fetchUsers();
        } catch (error) {
            handleAxiosError(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleDelete = async () => {
        if (!userToDelete) return;
        try {
            await userService.deleteUser(userToDelete.pkid);
            toast.success(`Usuário ${userToDelete.first_name} excluído.`);
            // Remove o usuário da lista local para feedback imediato
            setUserList(userList.filter(u => u.pkid !== userToDelete.pkid));
        } catch (error) {
            handleAxiosError(error);
        } finally {
            setUserToDelete(null);
        }
    };

    return ( // ── ◯─◡◠◡◠◡◠ DOM ◡◠◡◠◡◠◡◠─➤
        <Card variant='ghost'>
            <Flex justify="between" align="center" mb="4">
                <Heading>Gerenciamento de Usuários do Sistema</Heading>
                <Button onClick={() => setIsAddModalOpen(true)}><PlusCircle size={16} /> Adicionar Usuário</Button>
            </Flex>

            <Table.Root variant="surface">
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeaderCell>Nome</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Permissão</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell justify="center" >Instituições Criadas</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell />
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {isLoading ? (
                        <Table.Row><Table.Cell colSpan={4}>Carregando...</Table.Cell></Table.Row>
                    ) : (
                        userList.map(user => (
                            <Table.Row  align="center" key={user.pkid}>
                                <Table.Cell >{user.first_name} {user.last_name}</Table.Cell>
                                <Table.Cell>{user.email}</Table.Cell>
                                <Table.Cell>
                                    <Badge color={user.user_group === 67 ? 'orange' : 'gray'}>
                                        {user.user_group === 67 ? 'Admin' : 'Básico'}
                                    </Badge>
                                </Table.Cell>

                                <Table.Cell justify="center" >{user.instituicoes_count}</Table.Cell>

                                <Table.Cell justify="end">
                                    <Button color="red" variant="soft" onClick={() => setUserToDelete(user)}>
                                        <Trash2 size={16} />
                                    </Button>
                                </Table.Cell>
                            </Table.Row>
                        ))
                    )}
                </Table.Body>
            </Table.Root>

            {/* Modal para Adicionar Usuário */}
            <Dialog.Root open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <Dialog.Content>
                    <Dialog.Title>Criar Novo Usuário</Dialog.Title>
                    <AddUserForm // <○> AddUserForm
                        onSave={() => { setIsAddModalOpen(false); loadUsers(); }}
                        onCancel={() => setIsAddModalOpen(false)}
                    />
                </Dialog.Content>
            </Dialog.Root>

            {/* Modal para Confirmar Exclusão */}
            <AlertDialog.Root open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
                <AlertDialog.Content>
                    <AlertDialog.Title>Confirmar Exclusão</AlertDialog.Title>
                    <AlertDialog.Description>
                        Tem certeza que deseja excluir o usuário {userToDelete?.first_name}? Esta ação é irreversível.
                    </AlertDialog.Description>
                    <Flex gap="3" mt="4" justify="end">
                        <AlertDialog.Cancel><Button variant="soft">Cancelar</Button></AlertDialog.Cancel>
                        <AlertDialog.Action><Button color="red" onClick={handleDelete}>Excluir</Button></AlertDialog.Action>
                    </Flex>
                </AlertDialog.Content>
            </AlertDialog.Root>
        </Card>
    );
};