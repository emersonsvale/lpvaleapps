declare module '@typebot.io/js/web' {
    import type { BubbleProps, CommandArgs } from '@typebot.io/js'

    interface TypebotWeb {
        initBubble: (props: BubbleProps) => void
        open: (args?: CommandArgs) => void
        close: (args?: CommandArgs) => void
        toggle: (args?: CommandArgs) => void
        unmount: (args?: CommandArgs) => void
    }

    const Typebot: TypebotWeb

    export default Typebot
}