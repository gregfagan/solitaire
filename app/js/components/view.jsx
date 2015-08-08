import React from 'react';

var prefixableOptions = new Set(['start', 'end']);

function prefix(flexOption) {
  return prefixableOptions.has(flexOption) ?
    `flex-${flexOption}` :
    flexOption;
}

export default class View extends React.Component {
  render() {
    let { tag:Tag='div', direction='column', grow=0, shrink=0, basis='auto', justifyContent='start', alignItems='stretch', alignContent='stretch', wrap=false, style, ...other } = this.props;
    let flexStyle = {
      display: 'flex;display:-webkit-flex',
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
      flexWrap: wrap ? 'wrap' : 'nowrap'
    };
    return <Tag style={{...flexStyle, ...style}} {...other}/>
  }
}

export class ViewStackedInZ extends React.Component {
  render() {
    const { depth=0, thickness='1px', cascadeBy='0%', cascadeAtDepth=0, style, ...other } = this.props;
    return (
      <View style={{
          position: depth === 0 ? 'relative' : 'absolute',
          top: (depth > cascadeAtDepth) ? cascadeBy : 0,
          left: 0,
          zIndex: depth,
          transform: `translateZ(${thickness})`,
          ...style,
      }} {...other}/>
    );
  }
}