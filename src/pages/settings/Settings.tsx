// src/Settings.tsx
import { useState } from 'react';
import { Box, Button, Flex, Text } from '@radix-ui/themes';
import { InstituicaoListPage, InstituicaoDetailPage, InstituicaoForm } from './Instituicao';
import { useUserStore } from '../../store/userStore';
import { useAuthService } from '../../hooks/useAuthService';
import { LogOut } from 'lucide-react';
import { UserPanel } from './UserPanel';


const Settings = () => {

  const { user } = useUserStore(); // Pegamos os dados do usuário para a saudação
  const { logout } = useAuthService(); // 3. Pegamos a função de logout do nosso hook




  const [activeView, setActiveView] = useState<{ view: 'list' | 'detail' | 'create', id: number | null }>({
    view: 'list',
    id: null,
  });

  const handleSelectInstituicao = (id: number) => {
    setActiveView({ view: 'detail', id: id });
  };

  const handleShowCreateForm = () => {
    setActiveView({ view: 'create', id: null });
  };

  const handleBackToList = () => {
    setActiveView({ view: 'list', id: null });
  };

  const renderContent = () => {
    switch (activeView.view) {
      case 'detail':
        // Asseguramos que o id não é nulo para o TypeScript
        if (activeView.id !== null) {
          return <InstituicaoDetailPage instituicaoId={activeView.id} onBackToList={handleBackToList} />;
        }
        return null; // ou uma mensagem de erro

      case 'create':
        // O formulário de criação/edição. Passamos onSave para que ele possa nos notificar
        // para voltar para a lista após salvar.
        return <InstituicaoForm onSaveSuccess={handleBackToList} onCancel={handleBackToList} />;

      case 'list':
      default:
        return <InstituicaoListPage onSelectInstituicao={handleSelectInstituicao} onShowCreateForm={handleShowCreateForm} />;
    }
  };

  return (
    <div id="canvas" className="flex flex-col gap-10 justify-center items-center p-6">


      <Flex justify="between" align="center" className=" mb-6">

        <Text>Olá, <Text weight="bold">{user?.first_name}</Text>!</Text>
        <Button variant="soft" color="red" onClick={logout}>
          <LogOut size={16} className="mr-2" />
          Sair
        </Button>
      </Flex>


      <Box className="w-full max-w-5xl mt-20">
        <UserPanel />
      </Box>


      <Box className="w-full max-w-5xl mt-20">
        {renderContent()}
      </Box>
    </div>
  );
};

export default Settings;