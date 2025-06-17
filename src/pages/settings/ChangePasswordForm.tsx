// src/pages/settings/MudarSenhaForm.tsx
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, TextField, Flex, Text } from '@radix-ui/themes';
import { axiosForInterceptor } from '../../utils/axios';
import { toast } from 'react-toastify';


export const ChangePasswordForm = () => {
    const formik = useFormik({
        initialValues: { old_password: '', new_password1: '', new_password2: '' },
        validationSchema: Yup.object({
            old_password: Yup.string().required("Senha atual é obrigatória"),
            new_password1: Yup.string().min(8, "Mínimo de 8 caracteres").required("Nova senha é obrigatória"),
            new_password2: Yup.string().oneOf([Yup.ref('new_password1'), undefined], 'As senhas não conferem').required('Confirmação é obrigatória'),
        }),
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                await axiosForInterceptor.post('/auth/password/change/', values);
                toast.success("Senha alterada com sucesso!");
                resetForm();
            } catch (error) {
                // handleAxiosError(error)
                toast.error("Falha ao alterar a senha. Verifique sua senha atual.");
            } finally {
                setSubmitting(false);
            }
        }
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <Flex direction="column" gap="3">
                <label>
                    <Text as="div" size="2" mb="1" weight="bold">Senha Atual</Text>
                    <TextField.Root name="old_password" type="password" onChange={formik.handleChange} value={formik.values.old_password} />
                </label>
                <label>
                    <Text as="div" size="2" mb="1" weight="bold">Nova Senha</Text>
                    <TextField.Root name="new_password1" type="password" onChange={formik.handleChange} value={formik.values.new_password1} />
                </label>
                <label>
                    <Text as="div" size="2" mb="1" weight="bold">Confirmar Nova Senha</Text>
                    <TextField.Root name="new_password2" type="password" onChange={formik.handleChange} value={formik.values.new_password2} />
                </label>
                <Button mt="3" type="submit" disabled={formik.isSubmitting}>
                    {formik.isSubmitting ? 'Salvando...' : 'Alterar Senha'}
                </Button>
            </Flex>
        </form>
    );
};