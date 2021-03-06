import React from 'react';
import Collapse from './Collapse';
import { storiesOf } from '@storybook/react';
import { withNotes, withMarkdownNotes } from '@storybook/addon-notes';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { backgrounds } from 'root/stories/addon-backgrounds';
import Component from '@reach/component-component';
import 'components/Base/base.scss';
import 'root/stories/storybook.scss';

export default function CollapseStory() {
  const props = {};

  storiesOf('Collapses', module)
    .addDecorator(backgrounds)

    .add(
      'default',
      withMarkdownNotes(`
# Collapse default

usage description here

## React

~~~jsx
<Collapse isOpen={this.state.isOpen}>
  content
</Collapse>
~~~
      `)(() => (
        <Component initialState={{ isOpen: false }}>
          {({ state, setState }) => (
            <div className="box">
              <button className="btn" onClick={() => setState({ isOpen: !state.isOpen })}>
                toggle
              </button>
              <Collapse isOpen={state.isOpen}>
                <p className="text">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                  aliquip ex ea commodo consequat.
                </p>
              </Collapse>
              <p className="text">below content</p>
            </div>
          )}
        </Component>
      ))
    )

    .add(
      'multiple',
      withMarkdownNotes(`

## React

~~~jsx
<Collapse isOpen={this.state.isOpen1}>
  content
</Collapse>
<Collapse isOpen={this.state.isOpen2}>
  content
</Collapse>
~~~
      `)(() => (
        <Component initialState={{ isOpen1: false, isOpen2: false }}>
          {({ state, setState }) => (
            <>
              <div className="box">
                <button className="btn" onClick={() => setState({ isOpen1: !state.isOpen1 })}>
                  toggle
                </button>
                <Collapse isOpen={state.isOpen1}>
                  <p className="text">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat.
                  </p>
                </Collapse>
              </div>
              <div className="box">
                <button className="btn" onClick={() => setState({ isOpen2: !state.isOpen2 })}>
                  toggle
                </button>
                <Collapse isOpen={state.isOpen2}>
                  <p className="text">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat.
                  </p>
                </Collapse>
              </div>
            </>
          )}
        </Component>
      ))
    );
}
