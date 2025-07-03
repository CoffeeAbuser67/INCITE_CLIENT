// src/Settings.tsx
import { useState } from 'react';
import { Box, Heading, Tabs,  } from '@radix-ui/themes';
import { InstituicaoListPage, InstituicaoDetailPage, InstituicaoForm } from './Instituicao';
import { useUserStore } from '../../store/userStore';
import { UserPanel } from './UserPanel';
import { ChangePasswordForm } from './ChangePasswordForm';
import { GerenciamentoPostsGerais } from './PostsGerais';


const Settings = () => {

  const user = useUserStore((state) => state.user);
  const isAdmin = user?.user_group === 67;

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

  const renderInstituicaoContent = () => {
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

    <div id="canvas" className="p-4 sm:p-8 w-full h-full max-w-7xl mx-auto">
      
      <Heading size="8" mb="6">Painel de Controle</Heading>
      <Tabs.Root defaultValue="instituicoes">

        <Tabs.List color="gray" className='text-base'>

          <Tabs.Trigger value="instituicoes">Instituições</Tabs.Trigger>


          {isAdmin && (
            <>
              <Tabs.Trigger value="postsGerais">Posts Gerais</Tabs.Trigger>
              <Tabs.Trigger value="usuarios">Usuários</Tabs.Trigger>
              
            </>
          )}

          <Tabs.Trigger value="perfil">Perfil</Tabs.Trigger>

        </Tabs.List>

        <Box pt="6">

          <Tabs.Content value="instituicoes">
            {renderInstituicaoContent()}
          </Tabs.Content>

          {isAdmin && (
            <>
              <Tabs.Content value="postsGerais">
                <GerenciamentoPostsGerais />
              </Tabs.Content>

              <Tabs.Content value="usuarios">
                <UserPanel />
              </Tabs.Content>
            </>
          )}

          <Tabs.Content value="perfil">
            <ChangePasswordForm />
          </Tabs.Content>

        </Box>
      </Tabs.Root>


    </div>
  );
};

export default Settings;