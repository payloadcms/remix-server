import type { Page } from '@org/cms';
import { RichText } from '../RichText';
import { sizes } from './sizes';

type ImageProps = Page['layout'][0]

export const Image = (props: ImageProps) => {
    if (props.blockType !== 'image') return null;
    const { image, caption, type } = props;

    if (typeof image === 'object') {
        let filenameToRender = image.filename;
        let { width } = image;
        let { height } = image;

        if (image.sizes[type]) {
            filenameToRender = image.sizes[type].filename;
            width = image.sizes[type].width;
            height = image.sizes[type].height;
        }

        const sizesToUse = sizes
            .map((size) => `(max-width: ${size}px) ${size}px`)
            .join(', ');

        return (
            <div className={`image-wrap image-${type}`}>
                <img
                    src={`/media/${filenameToRender}`}
                    alt={image.alt}
                    sizes={sizesToUse}
                    width={width}
                    height={height}
                />
                {caption && (
                    <RichText className="image-caption" content={caption} />
                )}
            </div>
        );
    }

    return null;
};
