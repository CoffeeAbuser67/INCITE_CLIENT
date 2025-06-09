// src/Settings.tsx
import  { useState } from 'react';
import { Box } from '@radix-ui/themes';
import { InstituicaoListPage, InstituicaoDetailPage, InstituicaoForm } from './Instituicao';

const Settings = () => {

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
      <Box className="w-full max-w-5xl mt-20">
        {renderContent()}
      </Box>
    </div>
  );
};

export default Settings;