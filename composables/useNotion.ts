import { ref } from '#imports';

/**
 * Composable para trabajar con posts y contenido de Notion a través de los endpoints del servidor
 */
export function useNotion() {
    const loading = ref(false);
    const error = ref<string | null>(null);

    /**
     * Obtiene todos los posts del blog a través del API del servidor
     */
    const fetchPosts = async () => {
        loading.value = true;
        error.value = null;

        try {
            const posts = await $fetch('/api/notion/posts');
            return posts;
        } catch (err: any) {
            error.value = err.message || 'Error al cargar los posts';
            return [];
        } finally {
            loading.value = false;
        }
    };

    /**
     * Obtiene un post específico por su slug a través del API del servidor
     */
    const fetchPost = async (slug: string) => {
        loading.value = true;
        error.value = null;

        try {
            const post = await $fetch(`/api/notion/posts/${slug}`);
            return post;
        } catch (err: any) {
            error.value = err.message || `Error al cargar el post ${slug}`;
            return null;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Añade un comentario a un post a través del API del servidor
     */
    const addComment = async (pageId: string, comment: string) => {
        loading.value = true;
        error.value = null;

        try {
            const result = await $fetch('/api/notion/comments/add', {
                method: 'POST',
                body: {
                    pageId,
                    comment,
                },
            });
            return result;
        } catch (err: any) {
            error.value = err.message || 'Error al añadir el comentario';
            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Obtiene la representación HTML para un bloque de Notion
     */
    const renderBlock = (block: any): string => {
        if (!block) return '';

        // Determinar el tipo de bloque y renderizarlo adecuadamente
        switch (block.type) {
            case 'paragraph':
                return renderParagraph(block);
            case 'heading_1':
                return renderHeading(block, 'h1');
            case 'heading_2':
                return renderHeading(block, 'h2');
            case 'heading_3':
                return renderHeading(block, 'h3');
            case 'bulleted_list_item':
                return renderListItem(block, 'ul');
            case 'numbered_list_item':
                return renderListItem(block, 'ol');
            case 'to_do':
                return renderTodo(block);
            case 'toggle':
                return renderToggle(block);
            case 'code':
                return renderCode(block);
            case 'quote':
                return renderQuote(block);
            case 'divider':
                return '<hr class="my-6" />';
            case 'image':
                return renderImage(block);
            case 'video':
                return renderVideo(block);
            case 'callout':
                return renderCallout(block);
            case 'table':
                return renderTable(block);
            default:
                return `<div class="text-gray-500">Bloque no soportado: ${block.type}</div>`;
        }
    };

    // Funciones auxiliares para renderizar diferentes tipos de bloques
    const renderParagraph = (block: any): string => {
        const text = renderRichText(block.paragraph?.rich_text || []);
        return `<p class="my-3 leading-relaxed">${text}</p>`;
    };

    const renderHeading = (block: any, tag: 'h1' | 'h2' | 'h3'): string => {
        const text = renderRichText(block[block.type]?.rich_text || []);
        const classes = {
            h1: 'text-4xl font-bold mt-10 mb-4',
            h2: 'text-3xl font-bold mt-8 mb-3',
            h3: 'text-2xl font-semibold mt-6 mb-2',
        };
        return `<${tag} class="${classes[tag]}">${text}</${tag}>`;
    };

    const renderListItem = (block: any, listType: 'ul' | 'ol'): string => {
        const text = renderRichText(block[block.type]?.rich_text || []);
        return `<li class="ml-6 my-1">${text}</li>`;
    };

    const renderTodo = (block: any): string => {
        const text = renderRichText(block.to_do?.rich_text || []);
        const checked = block.to_do?.checked;
        const checkedClass = checked ? 'text-gray-500 line-through' : '';
        return `
      <div class="flex items-start my-2">
        <input type="checkbox" class="mt-1 mr-2" ${checked ? 'checked' : ''} disabled />
        <span class="${checkedClass}">${text}</span>
      </div>
    `;
    };

    const renderToggle = (block: any): string => {
        const text = renderRichText(block.toggle?.rich_text || []);
        const childrenHtml = block.children ? block.children.map((child: any) => renderBlock(child)).join('') : '';

        return `
      <details class="my-3 border border-gray-200 rounded p-3">
        <summary class="font-medium cursor-pointer">${text}</summary>
        <div class="mt-3 pl-4 border-l-2 border-gray-200">
          ${childrenHtml}
        </div>
      </details>
    `;
    };

    const renderCode = (block: any): string => {
        const text = block.code?.rich_text?.[0]?.plain_text || '';
        const language = block.code?.language || 'plain text';
        return `
      <pre class="bg-gray-800 text-white p-4 rounded my-4 overflow-x-auto">
        <code class="language-${language}">${text}</code>
      </pre>
    `;
    };

    const renderQuote = (block: any): string => {
        const text = renderRichText(block.quote?.rich_text || []);
        return `
      <blockquote class="pl-4 border-l-4 border-gray-300 italic my-4">
        ${text}
      </blockquote>
    `;
    };

    const renderImage = (block: any): string => {
        const url = block.image?.file?.url || block.image?.external?.url || '';
        const caption = block.image?.caption?.[0]?.plain_text || '';
        return `
      <figure class="my-6">
        <img src="${url}" alt="${caption}" class="rounded max-w-full h-auto" />
        ${caption ? `<figcaption class="text-sm text-center mt-2 text-gray-500">${caption}</figcaption>` : ''}
      </figure>
    `;
    };

    const renderVideo = (block: any): string => {
        const url = block.video?.file?.url || block.video?.external?.url || '';
        return `
      <div class="my-6">
        <video src="${url}" controls class="w-full rounded"></video>
      </div>
    `;
    };

    const renderCallout = (block: any): string => {
        const text = renderRichText(block.callout?.rich_text || []);
        const icon = block.callout?.icon?.emoji || '💡';
        return `
      <div class="bg-gray-100 p-4 rounded flex my-4">
        <div class="text-xl mr-3">${icon}</div>
        <div>${text}</div>
      </div>
    `;
    };

    const renderTable = (block: any): string => {
        if (!block.children || block.children.length === 0) return '';

        const rows = block.children;
        const hasHeader = block.table?.has_column_header || false;

        let html = '<div class="overflow-x-auto my-6"><table class="min-w-full divide-y divide-gray-200">';

        rows.forEach((row: any, rowIndex: number) => {
            const isHeader = hasHeader && rowIndex === 0;
            const cells = row.table_row?.cells || [];

            html += '<tr>';
            cells.forEach((cell: any[]) => {
                const cellText = cell.map((textObj: any) => renderRichText([textObj])).join('');
                if (isHeader) {
                    html += `<th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">${cellText}</th>`;
                } else {
                    html += `<td class="px-6 py-4 whitespace-normal text-sm">${cellText}</td>`;
                }
            });
            html += '</tr>';
        });

        html += '</table></div>';
        return html;
    };

    const renderRichText = (richTextArray: any[]): string => {
        return richTextArray
            .map((textObj: any) => {
                const text = textObj.plain_text || '';

                // Escapar HTML para evitar inyecciones
                const escapedText = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');

                // Aplicar formatos si existen
                if (!textObj.annotations) return escapedText;

                let formattedText = escapedText;

                if (textObj.annotations.bold) formattedText = `<strong>${formattedText}</strong>`;
                if (textObj.annotations.italic) formattedText = `<em>${formattedText}</em>`;
                if (textObj.annotations.strikethrough) formattedText = `<del>${formattedText}</del>`;
                if (textObj.annotations.underline) formattedText = `<u>${formattedText}</u>`;
                if (textObj.annotations.code) formattedText = `<code class="bg-gray-100 px-1 rounded">${formattedText}</code>`;

                // Si hay un link, envolverlo en una etiqueta de enlace
                if (textObj.href) {
                    formattedText = `<a href="${textObj.href}" target="_blank" class="text-blue-600 hover:underline">${formattedText}</a>`;
                }

                return formattedText;
            })
            .join('');
    };

    return {
        loading,
        error,
        fetchPosts,
        fetchPost,
        addComment,
        renderBlock,
    };
}
