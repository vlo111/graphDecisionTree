import React from 'react';
import { Group } from '@vx/group';
import { NodeGroup } from 'react-move';
import Link from './Link';
import { findCollapsedParent } from './utils';

const Links = (props) => {
  const {
    links, linkType, layout, orientation, stepPercent, selectedRoute,
  } = props;

  return (
    <NodeGroup
      data={links}
      keyAccessor={(d, i) => `${d.source.data.id}_${d.target.data.id}`}
      start={({ source, target }) => ({
        source: {
          x: source.data.x0 || source.x,
          y: source.data.y0 || source.y,
        },
        target: {
          x: source.data.x0 || source.x,
          y: source.data.y0 || source.y,
        },
      })}
      enter={({ source, target }) => {
        if (layout === 'polar') {
          return {
            source: {
              x: [source.x],
              y: [source.y],
            },
            target: {
              x: [target.x],
              y: [target.y],
            },
          };
        }
        return {
          source: {
            x: [source.x],
            y: [
              orientation === 'vertical'
                ? source.y
                : source.y
                                - ((source.depth === 0 ? -1 : 1)
                                    * (source.data
                                        && source.data.renderWidth / 2) || 0),
            ],
          },
          target: {
            x: [target.x],
            y: [
              orientation === 'vertical'
                ? target.y
                : target.y
                                - ((target.depth === 0 ? -1 : 1)
                                    * (target.data
                                        && target.data.renderWidth / 2) || 0),
            ],
          },
        };
      }}
      update={({ source, target }) => {
        if (layout === 'polar') {
          return {
            source: {
              x: [source.x],
              y: [source.y],
            },
            target: {
              x: [target.x],
              y: [target.y],
            },
          };
        }

        return {
          source: {
            x: [source.x],
            y: [
              orientation === 'vertical'
                ? source.y
                : source.y
                                - ((source.depth === 0 ? -1 : 1)
                                    * (source.data
                                        && source.data.renderWidth / 2) || 0),
            ],
          },
          target: {
            x: [target.x],
            y: [
              orientation === 'vertical'
                ? target.y
                : target.y
                                - ((target.depth === 0 ? -1 : 1)
                                    * (target.data
                                        && target.data.renderWidth / 2) || 0),
            ],
          },
        };
      }}
      leave={({ source, target }) => {
        const collapsedParent = findCollapsedParent(source);
        return {
          source: {
            x: [
              collapsedParent.data.x0 || collapsedParent.x,
            ], // assume not null because root (only parentless node, will never leave)
            y: [collapsedParent.data.y0 || collapsedParent.y],
          },
          target: {
            x: [
              collapsedParent.data.x0 || collapsedParent.x,
            ],
            y: [collapsedParent.data.y0 || collapsedParent.y],
          },
        };
      }}
    >
      {(nodes) => (
        <Group>
          {nodes.sort((x, y) => {
            const num = Number(selectedRoute.includes(x.data.target.data.id))
                            - Number(selectedRoute.includes(y.data.target.data.id));
            return num; // weird exception was being thrown so expanded this??
          }).map(({ key, data, state }) => (
            <Link
              data={state}
              linkType={linkType}
              layout={layout}
              orientation={orientation}
              stepPercent={stepPercent}
              stroke={
                  selectedRoute.some((d) => data.source.data.id === d)
                  && selectedRoute.some((d) => data.target.data.id === d)
                    ? '#26deb0'
                    : '#374469'
                            }
              strokeWidth="1"
              fill="none"
              key={key}
            />
          ))}
        </Group>
      )}
    </NodeGroup>
  );
};

export default Links;
