import { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Card,
  Flex,
  IconButton,
  Button,
  Heading,
  Table,
  Dialog,
  Text,
  TextField,
  Switch,
  AlertDialog,
} from "@radix-ui/themes";
import "yup-phone-lite";
import { useFormik } from "formik";
import handleAxiosError from "../../utils/handleAxiosError";
import useAxiosErrorInterceptor from "../../hooks/useAxiosErrorInterceptor";
import * as Yup from "yup";
import useAuthService from "../../utils/authService";
import useUserService from "../../utils/userService";
import { useUserStore } from "../../store/userStore";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";

// [●] ROLES
const ROLES = {
  User: 4,
  Staff: 3,
  Admin: 2,
  Super: 1
};

// <●> DeleteSVG
const DeleteSVG = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={18}
    fill="#990000"
    viewBox="0 0 24 24"
  >
    <path
      stroke="#990000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 7h16M6 10l1.701 9.358A2 2 0 0 0 9.67 21h4.662a2 2 0 0 0 1.968-1.642L18 10M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2H9V5Z"
    />
  </svg>
);

// <●> AddButtonSVG
const AddButtonSVG = () => (
  <>
    <svg
      width="24px"
      height="24px"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        id="Vector"
        d="M6 12H12M12 12H18M12 12V18M12 12V6"
        stroke="#eceeec"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </>
);

// <●> UserIconSVG
const UserIconSVG: React.FC<{ u_color: string }> = ({ u_color }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      fill={u_color}
      fillRule="evenodd"
      d="M6 8a6 6 0 1 1 12 0A6 6 0 0 1 6 8ZM5.43 16.902C7.057 16.223 9.224 16 12 16c2.771 0 4.935.22 6.559.898 1.742.727 2.812 1.963 3.382 3.76A1.03 1.03 0 0 1 20.959 22H3.035c-.69 0-1.188-.67-.978-1.335.568-1.797 1.634-3.033 3.374-3.762Z"
      clipRule="evenodd"
    />
  </svg>
); // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

// <●> AddUser
const AddUser = () => {
  const [open, setOpen] = useState(false);

  const axios = useAxiosErrorInterceptor();
  const { loadUsers } = useUserService();

  const passwordRules = /^(?=.*\d).{8,}$/;
  // min 8 characters, 1 upper case letter, 1 lower case letter, 1 numeric digit.

  const validationSchema = Yup.object({
    first_name: Yup.string().required("Patient name is required"),
    last_name: Yup.string().required("Parent name is required"),
    email: Yup.string().email("Invalid email address"),

    password1: Yup.string()
      .matches(passwordRules, {
        message:
          "Password must have: 1 numeric digit, and at least 8 characters",
      })
      .required("Required"),
    password2: Yup.string()
      .oneOf([Yup.ref("password1"), undefined], "Passwords must match")
      .required("Required"),
  });

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      password1: "",
      password2: "",
      isAdmin: false, // Add checkbox initial value
    },

    validationSchema,

    onSubmit: async (values) => {
      // _PIN_ ✦── Add User ✉ ──➤

      console.log("start values:", values); // [LOG] Patient saved

      const { isAdmin, ...rest } = values;
      let group_id = 3;
      if (isAdmin) {
        group_id = 2;
      }
      const newValues = { ...rest, user_group: group_id };
      console.log("end values:", newValues); // [LOG] Patient saved

      try {
        const url = "/auth/registration/";
        const res = await axios.post(url, newValues);
        console.log("response status:", res.status); // [LOG] response status
        await loadUsers();
        toast.success("User created!");
      } catch (err) {
        console.log("err", err); // [LOG] err
        handleAxiosError(err);
      }
      setOpen(false);
    },
  });

  return (
    <>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger>
          {/* //<○>  AddButtonSVG */}
          <IconButton color="orange" className="cursor-pointer">
            <AddButtonSVG />
          </IconButton>
        </Dialog.Trigger>

        <Dialog.Content maxWidth="450px">
          <form onSubmit={formik.handleSubmit}>
            <Dialog.Title>Add User</Dialog.Title>

            <Flex align="center" justify={"between"} gap="2" my="5">
              <Dialog.Description size="2">
                Create a new User.
              </Dialog.Description>

              <Flex gap="4">
                <Text size="2" weight="bold">
                  Admin
                </Text>
                <Switch
                  checked={formik.values.isAdmin}
                  onCheckedChange={(checked) =>
                    formik.setFieldValue("isAdmin", checked)
                  }
                  name="isAdmin"
                  size="2"
                />
              </Flex>
            </Flex>

            <Flex direction="column" gap="3">
              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  First Name
                </Text>
                <TextField.Root
                  type="text"
                  name="first_name"
                  value={formik.values.first_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.first_name && formik.errors.first_name && (
                  <Text size="2" color="red">
                    {formik.errors.first_name}
                  </Text>
                )}
              </label>

              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  Last Name
                </Text>
                <TextField.Root
                  type="text"
                  name="last_name"
                  value={formik.values.last_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.last_name && formik.errors.last_name && (
                  <Text size="2" color="red">
                    {formik.errors.last_name}
                  </Text>
                )}
              </label>

              <label>
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
              </label>

              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  Password
                </Text>
                <TextField.Root
                  type="password"
                  name="password1"
                  value={formik.values.password1}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />

                {formik.touched.password1 && formik.errors.password1 && (
                  <Text size="2" color="red">
                    {formik.errors.password1}
                  </Text>
                )}
              </label>

              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  Confirm Password
                </Text>
                <TextField.Root
                  type="password"
                  name="password2"
                  value={formik.values.password2}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />

                {formik.touched.password2 && formik.errors.password2 && (
                  <Text size="2" color="red">
                    {formik.errors.password2}
                  </Text>
                )}
              </label>

              {/* -------------------------------------------- */}
            </Flex>

            <Flex gap="3" mt="4" justify="end">
              <Dialog.Close>
                <Button variant="soft" color="gray">
                  Cancel
                </Button>
              </Dialog.Close>

              <Button type="submit">Save</Button>
            </Flex>
          </form>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
}; // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

// <●> RemoveUser
const RemoveUser = ({
  user_id,
  user_name,
}: {
  user_id: number | undefined;
  user_name: string | undefined;
}) => {
  const axios = useAxiosErrorInterceptor();
  const { loadUsers } = useUserService();
  const { logout } = useAuthService();
  const active_user = useUserStore((state) => state.user);

  // _PIN_ ✦── peformRemove ✉ ──➤
  const peformRemove = async () => {
    try {
      console.log("id is :", user_id); // [LOG]

      const url = `/auth/deleteUser/${user_id}/`;
      if (user_id == active_user?.pkid) {
        logout();
      }
      const res = await axios.delete(url);
      console.log("response :", res); // [LOG]

      await loadUsers();
    } catch (err) {
      console.log("err", err); // [LOG]
      handleAxiosError(err);
    }
  };

  return (
    <>
      <AlertDialog.Root>
        <AlertDialog.Trigger>
          <IconButton
            color="crimson"
            variant="ghost"
            size="1"
            className="cursor-pointer"
          >
            {/* // <○> DeleteSVG */}
            <DeleteSVG />
          </IconButton>
        </AlertDialog.Trigger>

        <AlertDialog.Content maxWidth="500px">
          {user_id == active_user?.pkid ? (
            <>
              <AlertDialog.Title>Delete your own user?</AlertDialog.Title>
              <AlertDialog.Description size="2">
                Are you sure you want to delete your user? This action is
                permanent and cannot be undone.
              </AlertDialog.Description>
            </>
          ) : (
            <>
              <AlertDialog.Title>Delete {user_name}</AlertDialog.Title>
              <AlertDialog.Description size="2">
                Are you sure you want to delete this user? This action is
                permanent and cannot be undone.
              </AlertDialog.Description>
            </>
          )}

          <Flex gap="3" justify="end">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </AlertDialog.Cancel>

            <AlertDialog.Action>
              <Button onClick={peformRemove} color="red">
                Delete
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </>
  );
}; //  . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

// <✪> UserTable
const UserTable = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { loadUsers } = useUserService();

  const active_user = useUserStore((state) => state.user);
  const userList = useUserStore((state) => state.userList);

  useEffect(() => {
    // _PIN_ ✦── reloadUsers ✉ ──➤
    const reloadUsers = async () => {
      console.log("active_user id", active_user?.pkid); //[LOG]
      setLoading(true);
      await loadUsers();
      setLoading(false);
    };

    reloadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── DOM
  return (
    <>
      <Card size="4">
        <Box className="flex flex-col justify-center">
          <Box className="flex justify-between items-center">
            <Heading as="h3" size="6" trim="start" mb="2">
              Users
            </Heading>

            {/* //<○> AddUser */}
            <AddUser />
          </Box>

          <Text as="p" size="2" mb="5" color="gray">
            Create or delete system users.
          </Text>
        </Box>

        <Table.Root>
          <Table.Body>
            {loading ? (
              <Table.Row>
                <Table.RowHeaderCell>
                  <Loader />
                </Table.RowHeaderCell>
              </Table.Row>
            ) : (
              userList.map((user, i) => (
                <Table.Row key={i}>
                  <Table.RowHeaderCell>
                    {/* // <○> UserIconSVG */}
                    {user.pkid == active_user?.pkid ? (
                      <UserIconSVG u_color="green" />
                    ) : (user.user_group == ROLES["Admin"] || user.user_group == ROLES["Super"] ) ? (
                      <UserIconSVG u_color="#ffa057" />
                    ) : (
                      <UserIconSVG u_color="gray" />
                    )}
                  </Table.RowHeaderCell>

                  <Table.Cell>
                    <Text size="2">{`${user?.first_name} ${user?.last_name}`}</Text>{" "}
                  </Table.Cell>

                  <Table.Cell>
                    <Text size="2" color="gray">
                      {user?.email}
                    </Text>
                  </Table.Cell>

                  <Table.Cell>
                    {(user.user_group == ROLES["Admin"] || user.user_group == ROLES["Super"]) ? (
                      <Badge color="orange" variant="soft" radius="full">
                        Admin
                      </Badge>
                    ) : (
                      <Badge color="gray" variant="soft" radius="full">
                        Staff
                      </Badge>
                    )}
                  </Table.Cell>

                  <Table.Cell>
                    <Flex flexGrow="1" justify="end" align="center">
                      {/* // <○> RemoveUser */}
                      <RemoveUser
                        user_id={user.pkid}
                        user_name={user.first_name}
                      />
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table.Root>
      </Card>
    </>
  );
}; // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

// ★ Settings ✦───────────────────────────────────────────────────➤
const Settings = () => {
  // ── ✦─DOM─➤
  return (
    <div
      id="canvas"
      className="flex flex-col gap-10 justify-center items-center p-6"
    >
      {/* //<○>  UserTable */}
      <UserTable />
    </div>
  );
}; // ★ ✦─────────────────────────────────────────────────────➤

export default Settings;
