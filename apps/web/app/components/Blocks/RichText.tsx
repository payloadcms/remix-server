import { serializeLexical } from './serialize'

type RichTextProps = JSX.IntrinsicElements['div'] & {
    content: any;
};

export const RichText = ({ className, content }: RichTextProps) => {
  if (!content) {
    return null
  }

  return (
    <div className={className}>
      {content &&
        !Array.isArray(content) &&
        typeof content === 'object' &&
        'root' in content &&
        serializeLexical({ nodes: content?.root?.children })}
    </div>
  )
}
