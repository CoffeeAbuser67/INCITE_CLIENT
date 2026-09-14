import { useState, useEffect } from "react";
import classNames from "classnames";
import { Avatar, Box, DropdownMenu, Text, Tooltip } from "@radix-ui/themes";
import { Link, useNavigate } from "react-router-dom";
import { useAuthService } from "../../hooks/useAuthService";
import { LayoutDashboard, LogIn, LogOut, BookOpen } from "lucide-react";
import { useUserStore } from "../../store/userStore";


import BahiaStroke from "../../assets/bahiaStroke";
import InciteLogo from "../../assets/InciteLogo";



const navItems = [ // [✪] navItems

    { icon: BookOpen, href: "/postagens", label: "Posts" },
    { icon: BahiaStroke, href: "/bahia", label: "Bahia" },

];

const SimplifiedNavbar = () => { // ★ SimplifiedNavbar ⋙────────────────➤
    const [scrolled, setScrolled] = useState(false);

    const user = useUserStore((state) => state.user);

    const navigate = useNavigate();
    const { logout } = useAuthService();


    useEffect(() => {//HERE uE
        const handleScroll = () => {
            // Verifica se o scroll passou de 50 pixels para um efeito mais notável
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);



    return (// ── ◯⫘⫘⫘⫘⫘⫘⫘ DOM ⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫸

        <Box
            id="SimplifiedNavBar"
            className={classNames(
                "fixed top-0 left-0 w-full flex items-center justify-center z-50",
                "transition-all duration-300 ease-in-out",
                scrolled
                    ? "h-16 bg-white/80 backdrop-blur-lg shadow-xl shadow-black/5" // Estilo scrollado
                    : "h-28 bg-black/0 shadow-xl shadow-white/20" // Estilo inicial 
            )}
        >
            <div
                id="contentWrapper"
                className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 flex justify-between items-center h-full" // Aumentei max-w-6xl
            >

                <Box
                    id="logoContainer"
                    className={classNames(
                        "cursor-pointer flex justify-center items-center",
                        "transition-all duration-300 ease-in-out",
                        "text-black group"
                    )}
                    onClick={() => navigate('/')}
                >
                    <InciteLogo height={40} />
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
                                        scrolled ? "text-base" : "text-lg" // ← Texto um pouco maior
                                    )}
                                >
                                    <Icon
                                        size={scrolled ? 20 : 24}
                                        className="transition-transform duration-150 group-hover:-translate-y-0.5"
                                    />

                                    <span className="font-semibold hidden md:inline">{item.label}</span>

                                </Link>

                                {isNotLast && (
                                    <span
                                        className={classNames(
                                            "ml-5 h-5 w-px bg-black/30",
                                            "h-5",
                                            "hidden md:block"
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
                                <Text className={scrolled ? "text-sm" : "text-base"}>Olá,
                                    <Text className={scrolled ? "text-sm" : "text-base"} weight="bold">{user.first_name}</Text>
                                </Text>

                                <Avatar
                                    size={scrolled ? "2" : "3"}
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