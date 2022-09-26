import type { MediaType } from '@org/cms/src/collections/Media';
import { RichText } from '../RichText';
import { sizes } from './sizes';

export type ImageType = {
    blockType: 'image';
    blockName?: string;
    image: MediaType;
    caption?: any;
    type: 'normal' | 'wide' | 'fullscreen';
};

export const Image = (props: ImageType) => {
    const { image, type, caption } = props;

    if (typeof image === 'object') {
        let filenameToRender = image.filename;
        let { width } = image;
        let { height } = image;

        if (image.sizes[type]) {
            filenameToRender = image.sizes[type];
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
