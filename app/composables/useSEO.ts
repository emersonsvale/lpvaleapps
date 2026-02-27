export const useSEO = () => {
    const baseUrl = 'https://valeapps.com.br'

    const setPageSEO = (options: {
        title?: string
        description?: string
        keywords?: string
        image?: string
        url?: string
        type?: string
        author?: string
        publishedTime?: string
        modifiedTime?: string
    }) => {
        const {
            title = 'Vale Apps - Soluções Digitais sob Medida',
            description = 'Soluções digitais sob medida com IA, automação e aplicativos web/mobile. Acelere seu negócio com sistemas modernos, ágeis e escaláveis.',
            keywords = 'desenvolvimento de apps, aplicativos mobile, desenvolvimento web, React Native, Flutter, Vue.js, React, produtos digitais, Vale Apps, IA, automação, soluções digitais',
            image = 'https://framerusercontent.com/images/u19OkEp1R8hzwiofmw2hDQyY.png',
            url = baseUrl,
            type = 'website',
            author = 'Vale Apps',
            publishedTime,
            modifiedTime
        } = options

        useHead({
            title,
            meta: [
                // Meta tags básicas
                { name: 'description', content: description },
                { name: 'keywords', content: keywords },
                { name: 'author', content: author },
                { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },

                // Open Graph
                { property: 'og:title', content: title },
                { property: 'og:description', content: description },
                { property: 'og:image', content: image },
                { property: 'og:image:alt', content: `${title} - Logo` },
                { property: 'og:url', content: url },
                { property: 'og:type', content: type },
                { property: 'og:site_name', content: 'Vale Apps' },
                { property: 'og:locale', content: 'pt_BR' },

                // Twitter Card
                { name: 'twitter:card', content: 'summary_large_image' },
                { name: 'twitter:title', content: title },
                { name: 'twitter:description', content: description },
                { name: 'twitter:image', content: image },
                { name: 'twitter:image:alt', content: `${title} - Logo` },
                { name: 'twitter:site', content: '@valeapps' },
                { name: 'twitter:creator', content: '@valeapps' },

                // Article meta (se aplicável)
                ...(publishedTime ? [{ property: 'article:published_time', content: publishedTime }] : []),
                ...(modifiedTime ? [{ property: 'article:modified_time', content: modifiedTime }] : []),

                // Geo tags para negócios locais
                { name: 'geo.region', content: 'BR-SP' },
                { name: 'geo.placename', content: 'São Paulo' },
                { name: 'geo.position', content: '-23.5505;-46.6333' },
                { name: 'ICBM', content: '-23.5505, -46.6333' },

                // Business info
                { name: 'business:contact_data:street_address', content: 'São Paulo, SP' },
                { name: 'business:contact_data:locality', content: 'São Paulo' },
                { name: 'business:contact_data:region', content: 'SP' },
                { name: 'business:contact_data:postal_code', content: '01000-000' },
                { name: 'business:contact_data:country_name', content: 'Brasil' },
                { name: 'business:contact_data:email', content: 'contato@valeapps.com.br' },
                { name: 'business:contact_data:phone_number', content: '+55-11-96921-0065' },
                { name: 'business:contact_data:website', content: baseUrl },

                // Mobile optimization
                { name: 'format-detection', content: 'telephone=yes' },
                { name: 'mobile-web-app-capable', content: 'yes' },
                { name: 'apple-mobile-web-app-capable', content: 'yes' },
                { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
                { name: 'apple-mobile-web-app-title', content: 'Vale Apps' },

                // Performance hints
                { name: 'theme-color', content: '#FFC000' },
                { name: 'msapplication-TileColor', content: '#FFC000' },
                { name: 'msapplication-config', content: '/browserconfig.xml' }
            ],
            link: [
                { rel: 'canonical', href: url },
                { rel: 'alternate', hreflang: 'pt-br', href: url },
                { rel: 'alternate', hreflang: 'x-default', href: url }
            ]
        })
    }

    const generateBreadcrumb = (items: Array<{ name: string; url?: string }>) => {
        const breadcrumbList = {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: items.map((item, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: item.name,
                ...(item.url && { item: `${baseUrl}${item.url}` })
            }))
        }

        useHead({
            script: [
                {
                    type: 'application/ld+json',
                    innerHTML: JSON.stringify(breadcrumbList)
                }
            ]
        })
    }

    const generateFAQSchema = (faqs: Array<{ question: string; answer: string }>) => {
        const faqSchema = {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map(faq => ({
                '@type': 'Question',
                name: faq.question,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: faq.answer
                }
            }))
        }

        useHead({
            script: [
                {
                    type: 'application/ld+json',
                    innerHTML: JSON.stringify(faqSchema)
                }
            ]
        })
    }

    const generateBlogPostingSchema = (options: {
        title: string
        description: string
        slug: string
        image?: string
        authorName?: string
        datePublished: string
        dateModified?: string
    }) => {
        const blogPosting = {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: options.title,
            description: options.description,
            image: options.image ? [options.image] : undefined,
            datePublished: options.datePublished,
            dateModified: options.dateModified || options.datePublished,
            author: {
                '@type': 'Person',
                name: options.authorName || 'Vale Apps'
            },
            publisher: {
                '@type': 'Organization',
                name: 'Vale Apps',
                logo: {
                    '@type': 'ImageObject',
                    url: `${baseUrl}/logo-header.png`
                }
            },
            mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': `${baseUrl}/blog/${options.slug}`
            },
            url: `${baseUrl}/blog/${options.slug}`
        }

        useHead({
            script: [
                {
                    type: 'application/ld+json',
                    innerHTML: JSON.stringify(blogPosting)
                }
            ]
        })
    }

    return {
        setPageSEO,
        generateBreadcrumb,
        generateFAQSchema,
        generateBlogPostingSchema,
        baseUrl
    }
}