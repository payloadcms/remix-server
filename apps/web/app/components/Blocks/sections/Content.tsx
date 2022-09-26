import { RichText } from '../RichText';

export type ContentType = {
    blockType: 'content';
    blockName?: string;
    content: unknown;
};

export const Content = (props: ContentType) => {
    const { content } = props;

    return (
        <div className="content-wrap">
            <RichText content={content} />
        </div>
    );
};
