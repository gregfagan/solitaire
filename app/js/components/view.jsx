import React, { PropTypes } from 'react';

var prefixableOptions = new Set(['start', 'end']);

function prefix(flexOption) {
  return prefixableOptions.has(flexOption) ?
    `flex-${flexOption}` :
    flexOption;
}

export default class View extends React.Component {
  render() {
    let { tag:Tag='div', direction='column', grow=0, shrink=0, basis='auto', justifyContent='start', alignItems='stretch', alignContent='stretch', alignSelf, wrap=false, style, ...other } = this.props;
    let flexStyle = {
      display: 'flex',
      boxSizing: 'border-box',
      position: 'relative',
      transformStyle: 'preserve-3d',
      flexDirection: direction,
      flexGrow: grow,
      flexShrink: shrink,
      flexBasis: basis,
      justifyContent: prefix(justifyContent),
      alignItems: prefix(alignItems),
      alignContent: prefix(alignContent),
      alignSelf: prefix(alignSelf),
      flexWrap: wrap ? 'wrap' : 'nowrap'
    };
    return <Tag style={{...flexStyle, ...style}} {...other}/>
  }
}

const cascadeDirectionToStyle = {
  down: 'top',
  right: 'left',
}

export class StackableView extends React.Component {
  static propTypes = {
    depth: PropTypes.number,
    thickness: PropTypes.string, // number with css unit
    cascadeBy: PropTypes.string, // number with css unit
    cascadeDirection: PropTypes.oneOf(['down', 'right']),
  }

  static defaultProps = {
    depth: 0,
    thickness: '1px',
    cascadeBy: '0%',
    cascadeDirection: 'down',
  }

  render() {
    const { depth, thickness, cascadeBy, cascadeDirection, style, ...other } = this.props;
    return (
      <View style={{
          position: depth === 0 ? 'relative' : 'absolute',
          top: 0,
          left: 0,
          [cascadeDirectionToStyle[cascadeDirection]]: depth > 0 ? cascadeBy : 0,
          zIndex: depth,
          transform: `translateZ(${thickness})`,
          ...style,
      }} {...other}/>
    );
  }
}