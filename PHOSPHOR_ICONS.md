# Phosphor Icons no Vale Apps

Este projeto agora usa a biblioteca [Phosphor Icons](https://phosphoricons.com/) em vez de emojis ou outros ícones.

## Instalação

A biblioteca já está instalada e configurada:

```bash
npm install @phosphor-icons/vue
```

## Configuração

O plugin está configurado em `plugins/phosphor-icons.client.ts` para uso global.

## Como Usar

### Importação

```vue
<script setup lang="ts">
import { PhHouse, PhUser, PhCode, PhRocket } from '@phosphor-icons/vue'
</script>
```

### No Template

```vue
<template>
  <!-- Ícone básico -->
  <PhHouse :size="24" />
  
  <!-- Com classes CSS -->
  <PhUser :size="20" class="text-blue-500" />
  
  <!-- Em botões -->
  <button class="flex items-center gap-2">
    <PhRocket :size="18" />
    <span>Começar Projeto</span>
  </button>
</template>
```

## Ícones Implementados

### Navegação
- `PhHouse` - Início
- `PhBriefcase` - Projetos  
- `PhCode` - Serviços
- `PhUser` - Sobre
- `PhChatCircle` - Contato
- `PhCaretRight` - Seta direita

### Botões de Ação
- `PhRocket` - Começar projeto
- `PhPlay` - Demo/Play

### Serviços
- `PhDeviceMobile` - Desenvolvimento Mobile
- `PhGlobe` - Desenvolvimento Web
- `PhPaintBrush` - UI/UX Design
- `PhCloud` - Cloud & DevOps
- `PhLightbulb` - Consultoria
- `PhWrench` - Suporte & Manutenção

### Tecnologias
- `PhAppleLogo` - iOS
- `PhAndroidLogo` - Android
- `PhFigmaLogo` - Figma
- `PhGear` - Configurações/AWS
- `PhShield` - Segurança
- `PhClock` - 24/7

### Outros
- `PhPalette` - Design System
- `PhChartLine` - Estratégia
- `PhUsers` - Mentoria/Equipe

## Exemplos de Uso

### Card de Serviço

```vue
<div class="p-6 border rounded-lg">
  <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
    <PhDeviceMobile :size="24" class="text-blue-600" />
  </div>
  <h3 class="font-bold mb-2">Desenvolvimento Mobile</h3>
  <p class="text-gray-600">Apps nativos para iOS e Android</p>
</div>
```

### Navegação com Ícones

```vue
<nav class="flex gap-4">
  <NuxtLink to="/" class="flex items-center gap-2">
    <PhHouse :size="16" />
    <span>Início</span>
  </NuxtLink>
  <NuxtLink to="/projetos" class="flex items-center gap-2">
    <PhBriefcase :size="16" />
    <span>Projetos</span>
  </NuxtLink>
</nav>
```

## Vantagens dos Phosphor Icons

1. **Consistência**: Todos os ícones seguem o mesmo estilo visual
2. **Variedade**: Mais de 1.200 ícones disponíveis
3. **Customização**: Fácil alteração de tamanho e cor
4. **Performance**: Ícones SVG otimizados
5. **Acessibilidade**: Melhor suporte para leitores de tela

## Recursos Úteis

- [Galeria de Ícones](https://phosphoricons.com/)
- [Documentação Vue](https://github.com/phosphor-icons/vue)
- [Playground Online](https://phosphoricons.com/)

## Migração de Emojis

Antes:
```vue
<span class="text-4xl">📱</span>
```

Depois:
```vue
<PhDeviceMobile :size="32" class="text-blue-600" />
```