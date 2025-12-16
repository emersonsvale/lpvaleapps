# Estrutura de Componentes - Vale Apps

A página principal foi dividida em componentes modulares para facilitar a manutenção e desenvolvimento individual de cada seção.

## 📁 Estrutura de Componentes

### Página Principal
- **`pages/index.vue`** - Página principal que importa e organiza todos os componentes

### Componentes de Seção
- **`components/HeroSection.vue`** - Seção hero com call-to-action principal
- **`components/ProjectsSection.vue`** - Showcase dos projetos desenvolvidos
- **`components/ServicesSection.vue`** - Grid de serviços oferecidos
- **`components/AboutSection.vue`** - Informações sobre a empresa e estatísticas
- **`components/ContactSection.vue`** - Formulário e informações de contato
- **`components/FooterSection.vue`** - Rodapé com informações da empresa

### Componentes UI Reutilizáveis
- **`components/ui/FloatingNav.vue`** - Navegação flutuante
- **`components/ui/Button.vue`** - Componente de botão customizável
- **`components/ui/Logo.vue`** - Logo da empresa
- **`components/ui/DottedSurface.vue`** - Fundo com padrão de pontos

## 🎯 Vantagens da Modularização

### 1. **Manutenibilidade**
- Cada seção pode ser editada independentemente
- Código mais organizado e fácil de encontrar
- Reduz conflitos em equipes

### 2. **Reutilização**
- Componentes podem ser reutilizados em outras páginas
- Facilita criação de variações das seções

### 3. **Performance**
- Possibilita lazy loading de seções específicas
- Melhor tree-shaking do código não utilizado

### 4. **Desenvolvimento**
- Trabalho paralelo em diferentes seções
- Testes isolados de cada componente
- Debugging mais eficiente

## 🔧 Como Trabalhar com os Componentes

### Editando uma Seção Específica
```bash
# Para editar a seção de projetos
code app/components/ProjectsSection.vue

# Para editar a seção sobre
code app/components/AboutSection.vue
```

### Adicionando Nova Seção
1. Crie o componente: `app/components/NovaSection.vue`
2. Importe no `pages/index.vue`
3. Adicione no template da página

### Estrutura Padrão de Componente
```vue
<template>
  <section class="py-20 bg-background">
    <div class="container mx-auto px-6">
      <!-- Conteúdo da seção -->
    </div>
  </section>
</template>

<script setup lang="ts">
// Imports dos ícones Phosphor
import { PhIcon } from '@phosphor-icons/vue'
// Imports de componentes UI
import Button from '~/components/ui/Button.vue'
</script>
```

## 📋 Checklist para Novos Componentes

- [ ] Usar ícones Phosphor em vez de emojis
- [ ] Seguir padrão de classes Tailwind
- [ ] Implementar responsividade (mobile-first)
- [ ] Adicionar hover states e transições
- [ ] Usar variáveis de cor do tema
- [ ] Testar em modo claro e escuro
- [ ] Verificar acessibilidade

## 🎨 Ícones Phosphor por Seção

### HeroSection
- `PhRocket` - Botão principal
- `PhPlay` - Botão secundário
- `PhCaretRight` - Navegação

### ProjectsSection  
- `PhShoppingCart` - E-commerce
- `PhBarbell` - Fitness
- `PhGraduationCap` - Educação

### ServicesSection
- `PhDeviceMobile` - Mobile
- `PhGlobe` - Web
- `PhPaintBrush` - Design
- `PhCloud` - Cloud
- `PhLightbulb` - Consultoria
- `PhWrench` - Suporte

### AboutSection
- `PhRocket` - Projetos
- `PhSmiley` - Satisfação
- `PhLightning` - Velocidade
- `PhTrophy` - Experiência
- `PhUsers` - Equipe

### ContactSection
- `PhEnvelope` - Email
- `PhWhatsappLogo` - WhatsApp
- `PhCalendar` - Agendamento

### FooterSection
- `PhHeart` - Amor
- `PhCoffee` - Café

## 🚀 Próximos Passos

1. **Animações**: Adicionar animações com @vueuse/motion
2. **Formulários**: Implementar formulário de contato funcional
3. **CMS**: Conectar com headless CMS para conteúdo dinâmico
4. **SEO**: Otimizar meta tags por seção
5. **Analytics**: Adicionar tracking de eventos por seção