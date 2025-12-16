# Uso dos Botões Padronizados

Baseado no `styles.json`, temos 3 tipos de botões padronizados:

## 1. Botão Primary (Principal)
Para CTAs principais como "Fale Conosco", "Começar Agora", etc.

```vue
<Button variant="primary" :withGradient="true">
  Fale Conosco
</Button>
```

## 2. Botão Secondary (Secundário)
Para ações importantes mas não críticas.

```vue
<Button variant="secondary">
  Saiba Mais
</Button>
```

## 3. Botão Ghost (Sutil)
Para navegação e ações sutis.

```vue
<Button variant="ghost">
  Ver Detalhes
</Button>
```

## Tamanhos Disponíveis
- `sm`: Pequeno
- `default`: Padrão
- `lg`: Grande

```vue
<Button variant="primary" size="lg" :withGradient="true">
  Botão Grande
</Button>
```

## Exemplo Completo com Link
```vue
<NuxtLink to="/contato">
  <Button variant="primary" :withGradient="true">
    <PhRocket :size="18" />
    Fale Conosco
  </Button>
</NuxtLink>
```

## Ou usando classes diretamente (como no HeroSection)
```vue
<NuxtLink to="#link" class="border text-sm font-medium relative border-neutral-200 dark:border-white/[0.2] text-black dark:text-white px-4 py-2 rounded-full hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors inline-flex items-center gap-2">
  <PhRocket :size="18" />
  <span>Fale conosco</span>
  <span class="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent h-px" />
</NuxtLink>
```