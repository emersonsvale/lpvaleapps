<template>
  <section class="py-24 md:py-32 relative overflow-hidden">
    <!-- Background -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-brand/[0.03] rounded-full blur-[100px]"></div>
    </div>

    <div class="container mx-auto px-6 relative z-10">
      <div
        v-motion
        :initial="sectionTitleReveal.initial"
        :visible-once="sectionTitleReveal.visibleOnce"
        class="text-center mb-16"
      >
        <p class="text-sm uppercase tracking-widest text-brand mb-4 font-medium">Dúvidas Frequentes</p>
        <h2 class="text-4xl md:text-6xl font-medium mb-6 leading-tight">
          Perguntas <span class="text-brand">Frequentes</span>
        </h2>
        <p class="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Tudo o que você precisa saber antes de começar seu projeto conosco.
        </p>
      </div>

      <div class="max-w-3xl mx-auto space-y-4">
        <div
          v-for="(faq, index) in faqs"
          :key="index"
          v-motion
          :initial="faqReveal.initial"
          :visible-once="{ ...faqReveal.visibleOnce, transition: { ...faqReveal.visibleOnce.transition, delay: index * 80 } }"
        >
          <details
            class="group rounded-2xl border border-white/[0.06] bg-zinc-900/60 backdrop-blur-sm transition-all duration-300 hover:border-brand/20"
            :open="index === 0"
          >
            <summary class="flex items-center justify-between cursor-pointer p-6 text-left select-none">
              <h3 class="text-base md:text-lg font-medium text-white pr-4">{{ faq.question }}</h3>
              <div class="flex-shrink-0 w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center transition-transform duration-300 group-open:rotate-45">
                <PhPlus :size="16" class="text-brand" />
              </div>
            </summary>
            <div class="px-6 pb-6 pt-0">
              <p class="text-zinc-400 text-sm md:text-base leading-relaxed">{{ faq.answer }}</p>
            </div>
          </details>
        </div>
      </div>

      <!-- CTA after FAQ -->
      <div
        v-motion
        :initial="faqReveal.initial"
        :visible-once="{ ...faqReveal.visibleOnce, transition: { ...faqReveal.visibleOnce.transition, delay: 500 } }"
        class="text-center mt-12"
      >
        <p class="text-zinc-400 mb-4">Ainda tem dúvidas?</p>
        <a
          href="https://wa.me/5511969210065?text=Olá! Tenho uma dúvida sobre os serviços da Vale Apps."
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-brand/20 text-brand hover:bg-brand/10 transition-all duration-300 text-sm font-medium"
        >
          <PhWhatsappLogo :size="18" />
          Fale conosco pelo WhatsApp
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { PhPlus, PhWhatsappLogo } from '@phosphor-icons/vue'
import { sectionTitleReveal, useRevealFadeUp } from '~/composables/useScrollRevealVariants'

const faqReveal = useRevealFadeUp({ y: 15 })

const faqs = [
  {
    question: 'Quanto custa desenvolver um aplicativo ou sistema web?',
    answer: 'O valor depende da complexidade do projeto. Um MVP simples pode partir de R$ 15.000, enquanto projetos mais robustos com múltiplas integrações podem variar. Oferecemos orçamento gratuito e sem compromisso — entre em contato pelo WhatsApp ou e-mail para uma proposta personalizada.'
  },
  {
    question: 'Quanto tempo leva para desenvolver um app?',
    answer: 'Um MVP funcional pode ficar pronto em 6 a 8 semanas. Projetos mais completos levam de 12 a 20 semanas. Nosso processo ágil permite que você veja progresso real a cada 2 semanas com entregas incrementais.'
  },
  {
    question: 'Vocês desenvolvem para iOS e Android ao mesmo tempo?',
    answer: 'Sim! Usamos tecnologias cross-platform como React Native e Flutter, que permitem criar apps para ambas as plataformas a partir de uma única base de código. Isso reduz significativamente o custo e tempo de desenvolvimento.'
  },
  {
    question: 'Vocês fazem manutenção após o lançamento?',
    answer: 'Sim. Oferecemos planos de suporte e manutenção contínua que incluem correções de bugs, atualizações de segurança, melhorias de performance e desenvolvimento de novas funcionalidades.'
  },
  {
    question: 'Como funciona a comunicação durante o projeto?',
    answer: 'Mantemos comunicação direta via WhatsApp e realizamos reuniões semanais de acompanhamento. Você tem visibilidade total do progresso com entregas parciais a cada 2 semanas.'
  },
  {
    question: 'Vocês trabalham com startups e MVPs?',
    answer: 'Com certeza! Temos experiência em construir MVPs rápidos para validação de mercado. Ajudamos startups a transformar ideias em produtos digitais funcionais no menor tempo possível, com foco em velocidade e qualidade.'
  },
  {
    question: 'Quais formas de pagamento vocês aceitam?',
    answer: 'Trabalhamos com pagamentos parcelados vinculados a entregas (milestones). Aceitamos transferência bancária, PIX e boleto. Assim, você paga conforme recebe progresso real do projeto.'
  }
]

// Gerar schema FAQPage para SEO
const { generateFAQSchema } = useSEO()
generateFAQSchema(faqs.map(faq => ({ question: faq.question, answer: faq.answer })))
</script>
