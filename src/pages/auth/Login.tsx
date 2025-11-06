
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthService } from "../../hooks/useAuthService"; // Seu hook customizado
import handleAxiosError from "../../utils/handleAxiosError"; // Sua função de erro

import {
  Box,
  Card,
  Flex,
  Text,
  Heading,
  Button,
  TextField,
} from "@radix-ui/themes";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuthService(); // Usa o hook que encapsula toda a lógica

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Endereço de email inválido")
      .required("Email é obrigatório"),
    password: Yup.string().required("Senha é obrigatória"),
  });

  const formik = useFormik({
    initialValues: {
      email: "", // Começa vazio em vez de usar valores padrão
      password: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const active_user = await login(values);
        toast.success(`Bem-vindo, ${active_user.first_name}!`);
        // Após o login bem-sucedido e o estado ser atualizado, navega para a página principal do painel
        navigate("/settings"); 
      } catch (err: unknown) {
        handleAxiosError(err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="flex w-full h-screen justify-center items-center bg-gray-50">
      <Card size="4" className="w-full max-w-md">
        <Heading as="h2" size="8" trim="start" mb="5">
          Painel INCITE-AF
        </Heading>
        <Text as="p" size="3" color="gray" mb="6">
          Faça login para continuar.
        </Text>

        <form onSubmit={formik.handleSubmit}>
          <Box mb="5">
            <Text as="div" size="2" mb="1" weight="bold">
              Email
            </Text>
            <TextField.Root
              size="3"
              type="email"
              name="email"
              autoComplete="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="seu.email@exemplo.com"
              disabled={formik.isSubmitting}
            />
            {formik.touched.email && formik.errors.email ? (
              <Text as="div" size="1" color="red" mt="1">
                {formik.errors.email}
              </Text>
            ) : null}
          </Box>

          <Box mb="5">
            <Text as="div" size="2" mb="1" weight="bold">
              Senha
            </Text>
            <TextField.Root
              size="3"
              type="password"
              name="password"
              autoComplete="current-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={formik.isSubmitting}
            />
            {formik.touched.password && formik.errors.password ? (
              <Text as="div" size="1" color="red" mt="1">
                {formik.errors.password}
              </Text>
            ) : null}
          </Box>

          <Flex mt="6" justify="end" gap="3">
            <Button size="3" type="submit" disabled={formik.isSubmitting}>
              {formik.isSubmitting ? 'Entrando...' : 'Entrar'}
            </Button>
          </Flex>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage