import type { Page } from '@org/cms';
import { Link } from '@remix-run/react';
import { RichText } from '../RichText';

export type Button =
    | {
          type: 'page';
          label: string;
          page: Page;
      }
    | {
          type: 'custom';
          label: string;
          url: string;
          newTab: boolean;
      };

export type CallToActionType = {
    blockType: 'cta';
    blockName?: string;
    content: unknown;
    buttons: Button[];
};

export const CallToAction: React.FC<CallToActionType> = (props) => {
    const { content, buttons } = props;

    return (
        <div className="cta">
            <div className="cta-wrap">
                <RichText content={content} className="cta-content" />
                {buttons && (
                    <ul className="cta-buttons">
                        {buttons.map((button, i) => (
                            <li key={i}>
                                {button.type === 'page' && (
                                    <Link
                                        to={'/' + button.page.slug ?? '/'}
                                        className="cta-button"
                                    >
                                        {button.label}
                                    </Link>
                                )}
                                {button.type === 'custom' && (
                                    <a
                                        className="cta-button"
                                        href={button.url}
                                        target={
                                            button.newTab ? '_blank' : undefined
                                        }
                                        rel="noopener noreferrer"
                                    >
                                        {button.label}
                                    </a>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};
