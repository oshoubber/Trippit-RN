import React from 'react';
import { Text } from 'react-native';

export class MonoText extends React.Component {
  render() {
    return <Text {...this.props} style={[this.props.style, { fontFamily: 'space-mono' }]} />;
  }
}

export class ZillaSlabText extends React.Component {
  render() {
    return <Text {...this.props} style={[this.props.style, { fontFamily: 'zillaSlabRegular' }]} />;
  }
}
