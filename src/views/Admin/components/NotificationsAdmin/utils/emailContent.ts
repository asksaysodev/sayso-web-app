import { EmailBlockType, EmailContent, EmailContentBlock, EmailFormBlock } from '../types';

export const BLOCK_LABELS: Record<EmailBlockType, string> = {
    paragraph: 'Paragraph',
    heading: 'Heading',
    list: 'List',
};

let nextId = 0;
export const newBlock = (type: EmailBlockType, text = ''): EmailFormBlock => ({ id: `block-${++nextId}`, type, text });

/** The server's content as editable blocks. A list becomes one item per line. */
export const toFormBlocks = (content: EmailContent | null): EmailFormBlock[] => {
    if (!content?.blocks.length) return [newBlock('paragraph')];
    return content.blocks.map(block =>
        block.type === 'list' ? newBlock('list', block.items.join('\n')) : newBlock(block.type, block.text),
    );
};

export const listItems = (text: string): string[] =>
    text
        .split('\n')
        .map(line => line.replace(/^\s*(?:[-*•]|\d+[.)])\s+/, '').trim())
        .filter(Boolean);

/** What the server stores. Empty blocks are left out, like the server does. */
export const toEmailContent = (title: string, blocks: EmailFormBlock[], ctaLabel: string, ctaUrl: string): EmailContent => ({
    title: title.trim(),
    blocks: blocks.flatMap((block): EmailContentBlock[] => {
        if (block.type === 'list') {
            const items = listItems(block.text);
            return items.length ? [{ type: 'list', items }] : [];
        }
        const text = block.text.trim();
        return text ? [{ type: block.type as 'paragraph' | 'heading', text }] : [];
    }),
    cta: ctaLabel.trim() || ctaUrl.trim() ? { label: ctaLabel.trim(), url: ctaUrl.trim() } : null,
});

const isHttpUrl = (value: string) => /^https?:\/\/[^\s/]+\.[^\s]+$/i.test(value);

/** Same checks as the server (utils/notificationEmailContent.js contentProblem), as a list. */
export const contentProblems = (content: EmailContent): string[] => {
    const problems: string[] = [];
    if (!content.title) problems.push('Email title is required');
    if (!content.blocks.some(b => b.type === 'paragraph' || b.type === 'list')) {
        problems.push('Add at least one paragraph or list to the email body');
    }
    if (content.cta) {
        if (!content.cta.label) problems.push('The button needs its text');
        if (!content.cta.url) problems.push('The button needs a link');
        else if (!isHttpUrl(content.cta.url)) problems.push('The button link must start with https://');
    }
    return problems;
};
