import React from 'react';

import { forNamespace } from '@trello/i18n';
const format = forNamespace();

/**
 * Implements https://github.com/mgduk/joinn for an array of React components,
 * rather than an array of strings. Like Array.join, but allows for a different
 * separator between the last two items.
 *
 * Example:
 * <Joinn
 *   components={[<strong>1</strong>, <em>2</em>, <a>3</a>]
 *   glue=", "
 *   lastGlue=" and "
 * } />
 * renders "1, 2 and 3" with the tags intact.
 */
interface JoinnProps {
  components: JSX.Element[];
  glue?: React.ReactNode;
  lastGlue?: React.ReactNode;
}

export const Joinn: React.FunctionComponent<JoinnProps> = ({
  components,
  glue = ', ',
  lastGlue = ` ${format('and')} `,
}) => {
  switch (components.length) {
    case 0:
      return <></>;
    case 1:
      return <>{components[0]}</>;
    default: {
      const truncated = components.slice(0, components.length - 2);
      const [secondLast, last] = components.slice(-2);

      return (
        <>
          {truncated.map((component) => (
            <React.Fragment key={component.key || ''}>
              {component}
              {glue}
            </React.Fragment>
          ))}
          {secondLast}
          {lastGlue}
          {last}
        </>
      );
    }
  }
};
