<template>
  <section class="py-20 relative overflow-hidden bg-background">
    <div class="container mx-auto px-6">
      <div class="max-w-4xl mx-auto text-center mb-12">
        <h2 class="text-4xl md:text-6xl font-medium mb-6">
          Acelere seu desenvolvimento
        </h2>
        <p class="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
          Criar seu aplicativo não deveria levar meses. Pelo menos não com a tecnologia atual. Com a Vale Apps, você pode projetar, desenvolver, iterar e escalar em semanas, não em meses. Seja mais ágil, construa de forma mais inteligente.
        </p>
      </div>

      <!-- Comparison Timelines -->
      <div class="max-w-6xl mx-auto space-y-16">
        <!-- Vale Apps Timeline -->
        <div class="space-y-6">
          <h3 class="text-2xl font-medium">Desenvolvimento Vale Apps</h3>
          <div class="relative pt-8 pb-16">
            <!-- Timeline Base Line -->
            <div class="absolute top-8 left-0 right-0 h-0.5 bg-muted"></div>
            <!-- Progress Bar (thick) -->
            <div class="absolute top-8 left-0 h-1 bg-brand" style="width: 100%;"></div>
            
            <!-- Timeline Container -->
            <div class="relative">
              <!-- Start Point -->
              <div class="absolute left-0 top-0 flex flex-col items-start">
                <div class="w-3 h-3 bg-brand rounded-full mb-2"></div>
                <span class="text-sm font-medium">Hoje</span>
              </div>

              <!-- Week 8-12 Milestone -->
              <div class="absolute left-[40%] top-0 flex flex-col items-center -translate-x-1/2">
                <div class="w-12 h-12 bg-brand/20 rounded-lg flex items-center justify-center mb-3 border-2 border-dashed border-brand">
                  <!-- Lightning Icon SVG -->
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-brand">
                    <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" fill="currentColor"/>
                  </svg>
                </div>
                <div class="absolute top-14 text-center whitespace-nowrap">
                  <div class="text-xs text-muted-foreground mb-1">SEMANAS 8-12</div>
                  <div class="text-sm font-semibold">Versão do aplicativo 1</div>
                </div>
              </div>

              <!-- Dotted line at 8-12 weeks -->
              <div class="absolute left-[40%] top-8 bottom-0 w-px border-l border-dashed border-muted-foreground/30"></div>

              <!-- Week 20 Milestone -->
              <div class="absolute right-0 top-0 flex flex-col items-end">
                <div class="w-3 h-3 bg-white rounded-full mb-2"></div>
                <div class="text-right whitespace-nowrap">
                  <div class="text-xs text-muted-foreground mb-1">SEMANA 20</div>
                  <div class="text-sm font-semibold">Versão 3 do aplicativo</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Regular Development Timeline -->
        <div class="space-y-6">
          <h3 class="text-2xl font-medium text-muted-foreground">Desenvolvimento Regular</h3>
          <div class="relative pt-8 pb-16">
            <!-- Timeline Base Line -->
            <div class="absolute top-8 left-0 right-0 h-0.5 bg-muted"></div>
            <!-- Progress Bar (thin) -->
            <div class="absolute top-8 left-0 h-0.5 bg-muted-foreground/30" style="width: 100%;"></div>
            
            <!-- Timeline Container -->
            <div class="relative">
              <!-- Start Point -->
              <div class="absolute left-0 top-0 flex flex-col items-start">
                <div class="w-3 h-3 bg-muted-foreground rounded-full mb-2"></div>
                <span class="text-sm font-medium text-muted-foreground">Hoje</span>
              </div>

              <!-- Dotted line at 8-12 weeks -->
              <div class="absolute left-[40%] top-0 bottom-0 w-px border-l border-dashed border-muted-foreground/30"></div>

              <!-- Week 20 Milestone -->
              <div class="absolute right-0 top-0 flex flex-col items-end">
                <div class="w-3 h-3 bg-white rounded-full mb-2"></div>
                <div class="text-right whitespace-nowrap">
                  <div class="text-xs text-muted-foreground mb-1">SEMANA 20</div>
                  <div class="text-sm font-semibold text-muted-foreground">Versão do aplicativo 1</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Componente de comparação de desenvolvimento
</script>

<style scoped>
/* Estilos adicionais se necessário */
</style>
