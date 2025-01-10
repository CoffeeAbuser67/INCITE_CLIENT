// HERE


import {
  Box,
  Card,
  Flex,
  Text,
  Heading,
  Button,
  TextField,
} from "@radix-ui/themes";

import { useFormik } from "formik";
import * as Yup from "yup";

import { useNavigate } from "react-router-dom";

import useAuthService from "../../utils/authService";
import handleAxiosError from "../../utils/handleAxiosError";
import { toast } from "react-toastify";

// WARN Must be empty in prodcution 
const defaultValues = {
  email: "kenneth86@example.com", // default email value
  password: ")f%X6tfi^5", // default password value
};


// ★ Login ⋙── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ──➤
const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthService();


  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address"),
    password: Yup.string().required("Password is required"),
  });

  // ✪ formik
  const formik = useFormik({
    initialValues: defaultValues,
    validationSchema,

    onSubmit: async (values) => {
      try {
        const active_user = await login(values);
        const message = `Welcome, ${active_user?.first_name}! `;
        toast.success(message);
        navigate("/");
      } catch (err: unknown) {
        handleAxiosError(err);
      } 
    },
  });

  return (
    //──✦─DOM────➤
    <div className="flex flex-col gap-10 w-full h-full justify-center items-center">
      <Card size="4" className=" flex flex-col w-full max-w-lg  ">
        <Heading as="h2" size="8" trim="start" mb="7" color="orange">
          Crescer
        </Heading>

        <Heading as="h3" size="5" trim="start" mb="5">
          Sign in
        </Heading>

        <form onSubmit={formik.handleSubmit}>
          <Box mb="5">
            <Text as="div" size="2" mb="1" weight="bold">
              Email
            </Text>

            <TextField.Root
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email && (
              <Text size="2" color="red">
                {formik.errors.email}
              </Text>
            )}
          </Box>

          <Box mb="5" position="relative">
            <Flex align="baseline" justify="between" mb="1">
              <Text
                as="label"
                size="2"
                weight="bold"
                htmlFor="example-password-field"
              >
                Password
              </Text>
            </Flex>

            <TextField.Root
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

            {formik.touched.password && formik.errors.password && (
              <Text size="2" color="red">
                {formik.errors.password}
              </Text>
            )}
          </Box>

          <Flex mt="6" justify="end" gap="3">
            <Button variant="outline" type="submit">
              Sign in
            </Button>
          </Flex>
        </form>
      </Card>
    </div>
  );
}; // ★ ⋙── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ──➤

export default Login;
