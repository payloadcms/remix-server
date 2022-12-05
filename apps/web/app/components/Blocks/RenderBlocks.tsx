import React from 'react';
import { components } from '.';
import type { Page } from '@org/cms';

export type Layout = Page['layout']

type Props = {
    layout: Layout;
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
