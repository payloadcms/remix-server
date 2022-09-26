import React from 'react';
import { components } from '.';
import type { CallToActionType } from './sections/CallToAction';
import type { ContentType } from './sections/Content';
import type { ImageType } from './sections/Image';

export type Layout = CallToActionType | ContentType | ImageType;

type Props = {
    layout: Layout[];
    className?: string;
};

export const RenderBlocks: React.FC<Props> = ({ layout, className }) => (
    <div className="block">
        {layout.map((block, i) => {
            const Block: React.FC<any> = components[block.blockType];

            if (Block) {
                return (
                    <section key={i}>
                        <Block {...block} />
                    </section>
                );
            }

            return null;
        })}
    </div>
);
