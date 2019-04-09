/*
Copyright (c) 2018 Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/
// @flow
import React from 'react';
import Popper from 'popper.js';
import {TetherBehavior} from '../index.js';
import {mount} from 'enzyme';

// Mock popper.js (see __mocks__ directory for impl)
jest.mock('popper.js');

describe('TetherBehavior', () => {
  let wrapper;

  afterEach(() => {
    wrapper && wrapper.unmount();
  });

  test('basic render', () => {
    const onPopperUpdate = jest.fn();
    class Wrapper extends React.Component<{}, {isMounted: boolean}> {
      anchorRef = React.createRef();
      popperRef = React.createRef();
      state = {isMounted: false};
      componentDidMount() {
        this.setState({isMounted: true});
      }
      render() {
        return (
          <>
            <div ref={this.anchorRef}>This is anchor</div>
            <TetherBehavior
              anchorRef={this.anchorRef.current}
              popperRef={this.popperRef.current}
              onPopperUpdate={onPopperUpdate}
            >
              <div ref={this.popperRef}>This is popper</div>
            </TetherBehavior>
          </>
        );
      }
    }
    const wrapper = mount(<Wrapper />);
    // Popper library should have been initialized
    expect(Popper).toHaveBeenCalled();
    const calls = Popper.mock.calls;
    expect(calls[0][0]).toBe(wrapper.instance().anchorRef.current);
    expect(calls[0][1]).toBe(wrapper.instance().popperRef.current);
    expect(calls[0][2]).toMatchObject({
      modifiers: {applyReactStyle: {fn: onPopperUpdate}},
    });
    expect(wrapper.childAt(1)).toHaveText('This is popper');
  });
});
