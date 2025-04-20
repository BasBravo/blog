// Eliminamos las importaciones de @notionhq/client
// Ahora usaremos el backend propio en NUXT_FUNCTIONS_URL

// Helper function to map Notion colors to custom CSS classes
export const mapColorToClass = (color: string): string => {
    const colorMap: Record<string, string> = {
        gray: 'notion-color-gray',
        brown: 'notion-color-brown',
        orange: 'notion-color-orange',
        yellow: 'notion-color-yellow',
        green: 'notion-color-green',
        blue: 'notion-color-blue',
        purple: 'notion-color-purple',
        pink: 'notion-color-pink',
        red: 'notion-color-red',
        gray_background: 'notion-bg-gray',
        brown_background: 'notion-bg-brown',
        orange_background: 'notion-bg-orange',
        yellow_background: 'notion-bg-yellow',
        green_background: 'notion-bg-green',
        blue_background: 'notion-bg-blue',
        purple_background: 'notion-bg-purple',
        pink_background: 'notion-bg-pink',
        red_background: 'notion-bg-red',
    };
    return colorMap[color] || ''; // Return empty string for 'default' or unknown colors
};

// Function to get classes for a rich text segment
// Define a more specific type for annotations if possible, otherwise use Record<string, any>
interface RichTextAnnotations {
    bold?: boolean;
    italic?: boolean;
    strikethrough?: boolean;
    underline?: boolean;
    code?: boolean;
    color?: string;
}

export const getRichTextClasses = (annotations: RichTextAnnotations): string => {
    let classes: string[] = [];
    if (annotations.bold) classes.push('notion-bold');
    if (annotations.italic) classes.push('notion-italic');
    if (annotations.strikethrough) classes.push('notion-strikethrough');
    if (annotations.underline) classes.push('notion-underline');
    if (annotations.code) classes.push('notion-inline-code'); // Use custom class for inline code

    const color = annotations.color || 'default';

    // Handle text color, ensuring it's not a background color unless specifically applied to code
    if (color !== 'default' && !color.endsWith('_background')) {
        classes.push(mapColorToClass(color));
    }
    // Handle inline background colors (highlights)
    if (color !== 'default' && color.endsWith('_background')) {
        classes.push(mapColorToClass(color)); // Background class includes padding/rounding via CSS
    }

    return classes.join(' ');
};

// Custom class for inline code elements (used via <code> tag or annotation)
export const codeTagClasses = 'notion-inline-code';
// Custom class for link elements
export const linkClasses = 'notion-link';
