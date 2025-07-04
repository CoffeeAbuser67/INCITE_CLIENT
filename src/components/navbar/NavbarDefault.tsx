import { useEffect, useState } from "react";
import classNames from "classnames";
import { Avatar, Box, Dialog, DropdownMenu, Text, Tooltip } from "@radix-ui/themes";
import { Link, useNavigate } from "react-router-dom";
import { useAuthService } from "../../hooks/useAuthService";
import { LayoutDashboard, LogIn, LogOut, BookOpen, ChartColumnBig, } from "lucide-react";


import { useUserStore } from "../../store/userStore";



const navItems = [ // [✪] navItems

    { icon: BookOpen, href: "/blog", label: "Blog" },
    { icon: ChartColumnBig, href: "/dashboard", label: "Dashboard" },

];



const SimplifiedNavbar = () => { // ★ SimplifiedNavbar ⋙────────────────➤


    const user = useUserStore((state) => state.user);
    const navigate = useNavigate();
    const { logout } = useAuthService();




    return (// ── ◯⫘⫘⫘⫘⫘⫘⫘ DOM ⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫸
        <Box
            id="SimplifiedNavBar"
            className={classNames(
                "w-full flex items-center justify-center z-50",
                "h-28 bg-black/0 shadow-xl shadow-white/20" // Estilo inicial 
            )}
        >
            <div
                id="contentWrapper"
                className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 flex justify-between items-center h-full" // Aumentei max-w-6xl
            >

                <Box
                    id="logoContainer"
                    className={classNames(
                        "cursor-pointer flex justify-center items-center gap-2",
                        "transition-all duration-300 ease-in-out",
                        "group" // ← Para habilitar group-hover nos filhos
                    )}
                    onClick={() => navigate('/')}
                >
                    <Text
                        className="text-black"
                        size={"8"}
                        highContrast
                        weight="bold"
                        style={{ textShadow: "0 2px 6px rgba(0,0,0,0.2)" }}
                    >
                        Incite
                    </Text>

                    <Text
                        className={classNames(
                            "text-green-700 transition duration-300",
                            "group-hover:drop-shadow-lg group-hover:-translate-y-0.5",
                            "text-[2rem]"
                        )}
                        highContrast
                        weight="bold"
                        style={{ textShadow: "0 2px 6px rgba(0,0,0,0.2)" }}
                    >
                        AF
                    </Text>
                </Box>




                <nav className="flex items-center space-x-6">
                    {navItems.map((item, index) => {
                        const Icon = item.icon;
                        const isNotLast = index < navItems.length - 1;

                        return (
                            <div key={item.href} className="flex items-center">
                                <Link
                                    to={item.href}
                                    aria-label={item.label}
                                    className={classNames(
                                        "group inline-flex items-center gap-2 transition-colors duration-150",
                                        "text-black hover:text-green-700",
                                        "text-lg"
                                    )}
                                >
                                    <Icon
                                        size={24}
                                        className="transition-transform duration-150 group-hover:-translate-y-0.5"
                                    />
                                    <span className="font-semibold">{item.label}</span>
                                </Link>

                                {isNotLast && (
                                    <span
                                        className={classNames(
                                            "ml-5 h-5 w-px bg-black/30",
                                            "h-5"
                                        )}
                                    ></span>
                                )}
                            </div>
                        );
                    })}
                </nav>



                {user ? ( // (○) getOptimisticUserInfo

                    <Dialog.Root>
                        <DropdownMenu.Root>
                            <DropdownMenu.Trigger>

                                <button className={classNames(
                                    "flex items-center gap-3 ",
                                    "text-sm font-medium rounded-full p-1",
                                    "hover:bg-green-50 transition-colors focus:outline-none"

                                )}>
                                    <Text className={"text-base"}>Olá,
                                        <Text className={"text-base"} weight="bold">{user.first_name}</Text>
                                    </Text>

                                    <Avatar
                                        size={"3"}
                                        src={`https://ui-avatars.com/api/?name=${user.first_name}&background=random`}
                                        fallback={"🦀"}
                                        radius="full"
                                    />
                                </button>

                            </DropdownMenu.Trigger>


                            <DropdownMenu.Content>
                                <DropdownMenu.Label>Minha Conta</DropdownMenu.Label>

                                {/* O Dialog.Trigger abre a modal de edição de perfil */}


                                <DropdownMenu.Item
                                    onClick={() => navigate('/settings')}
                                >
                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                    Painel
                                </DropdownMenu.Item>

                                {/* <DropdownMenu.Item><User className="mr-2 h-4 w-4" /> Meu Perfil</DropdownMenu.Item> */}


                                {/* TODO: Criar um formulário para editar o perfil do usuário */}

                                <DropdownMenu.Separator />

                                <DropdownMenu.Item
                                    onClick={() => logout()} color="red"
                                >
                                    <LogOut className="mr-2 h-4 w-4" /> Sair
                                </DropdownMenu.Item>

                            </DropdownMenu.Content>


                        </DropdownMenu.Root>


                    </Dialog.Root>


                ) : (

                    <Tooltip content="Log-In">
                        <Box
                            onClick={() => navigate('/auth/login')}
                            className={classNames(
                                "group inline-flex items-center gap-2 transition-colors duration-150",
                                "cursor-pointer"
                            )}
                        >
                            <LogIn
                                size={24}
                                stroke="#000"
                                className={classNames(
                                    "transition-transform duration-150 group-hover:-translate-y-0.5 mr-2",
                                    "stroke-black hover:stroke-green-700"
                                )}
                            />
                        </Box>
                    </Tooltip>

                )}




            </div>
        </Box >
    );
};  // ★ SimplifiedNavbar ⋙────────────────➤

export default SimplifiedNavbar;