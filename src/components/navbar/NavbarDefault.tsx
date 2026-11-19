import classNames from "classnames";
import { Avatar, Box, DropdownMenu, Text, Tooltip } from "@radix-ui/themes";
import { Link, useNavigate } from "react-router-dom";
import { useAuthService } from "../../hooks/useAuthService";
import { LayoutDashboard, LogIn, LogOut, BookOpen } from "lucide-react";

import { useUserStore } from "../../store/userStore";


import BahiaStroke from "../../assets/bahiaStroke";

// Marca do cliente: ícone + palavra, carregados como arquivo.
// São SVGs pesados (vetorização densa), então vão por <img> em vez de
// embutidos no JS — o navegador baixa uma vez e guarda em cache.
import iconeIncite from "../../assets/incite-icone.svg";
// import palavraIncite from "../../assets/incite-palavra.svg";




const navItems = [ // [✪] navItems

    { icon: BookOpen, href: "/postagens", label: "Posts" },
    { icon: BahiaStroke, href: "/bahia", label: "Bahia" },

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

                {/* Link em vez de Box com onClick: funciona com teclado,
                    e "abrir em nova aba" passa a funcionar também. */}
                <Link
                    id="logoContainer"
                    to="/"
                    aria-label="INCITE Agricultura Familiar — página inicial"
                    className={classNames(
                        "flex items-center gap-3",
                        "transition-opacity duration-200 hover:opacity-80"
                    )}
                >
                    <img
                        src={iconeIncite}
                        alt=""
                        className="h-11 w-auto flex-shrink-0"
                    />
                    {/* <img
                        src={palavraIncite}
                        alt=""
                        className="h-9 w-auto hidden sm:block"
                    /> */}
                </Link>



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

                                    <span className="font-semibold hidden md:inline">{item.label}</span>

                                </Link>

                                {isNotLast && (
                                    <span
                                        className={classNames(
                                            "ml-5 h-5 w-px bg-black/30",
                                            "h-5",
                                            "hidden md:block" // _// Esconde no mobile, mostra no desktop_
                                        )}
                                    ></span>
                                )}
                            </div>
                        );
                    })}
                </nav>


                {user ? (

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
                            <DropdownMenu.Separator />
                            <DropdownMenu.Item
                                onClick={() => logout()} color="red"
                            >
                                <LogOut className="mr-2 h-4 w-4" /> Sair
                            </DropdownMenu.Item>
                        </DropdownMenu.Content>
                    </DropdownMenu.Root>

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