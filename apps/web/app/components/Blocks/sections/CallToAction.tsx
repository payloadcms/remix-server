import type { Page } from '@org/cms';
import { Link } from '@remix-run/react';
import { RichText } from '../RichText';

type CallToActionProps = Page['layout'][0];

export const CallToAction: React.FC<CallToActionProps> = (props) => {
    if (props.blockType !== 'cta') return null;
    const { content, buttons } = props;

    return (
        <div className="cta">
            <div className="cta-wrap">
                <RichText content={content} className="cta-content" />
                {buttons && (
                    <ul className="cta-buttons">
                        {buttons.map((button, i) => (
                            <li key={i}>
                                {typeof button?.page === 'object' && (
                                    <Link
                                        to={'/' + button?.page?.slug ?? '/'}
                                        className="cta-button"
                                    >
                                        {button.label}
                                    </Link>
                                )}
                                {typeof button?.page === 'string'  && (
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
