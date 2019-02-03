import './collapse.scss';
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';

const COLLAPSED = 'collapsed';
const COLLAPSING = 'collapsing';
const EXPANDING = 'expanding';
const EXPANDED = 'expanded';

export default function Collapse(props) {
  const {
    className,
    children,
    transition,
    render,
    elementType,
    collapseHeight, // exclude from attrs
    onChange, // exclude from attrs
    isOpen, // exclude from attrs
    ...attrs
  } = props;

  const content = useRef(null);
  const [collapseState, setCollapseState] = useState(props.isOpen ? EXPANDED : COLLAPSED);
  const [collapseStyle, setCollapseStyle] = useState({
    height: props.collapseHeight || '0px',
    visibility: props.collapseHeight ? '' : 'hidden',
  });
  const [hasReversed, setHasReversed] = useState(false);

  useEffect(() => {
    console.log('componentDidMount');

    onChangeCallback();

    if (collapseState === EXPANDED) setExpanded();
  }, []);

  useLayoutEffect(() => {
    console.log('componentDidUpdate');

    if (!content) return;

    console.log('componentDidUpdate - real work');

    updateStyleStateFromCollapseState();
  }, [collapseState]);

  function onChangeCallback() {
    console.log('onChangeCallback');

    if (props.onChange) {
      props.onChange({
        collapseState,
        collapseStyle,
        hasReversed,
        isMoving: isMoving(collapseState),
      });
    }
  }

  function setCollapsed() {
    console.log('setCollapsed');

    if (!content) return;

    setCollapseStyle({
      height: getCollapseHeight(props),
      visibility: getCollapsedVisibility(props),
    });
    onChangeCallback();
    console.log('setCollapsed done', collapseStyle);
  }

  function setCollapsing() {
    console.log('setCollapsing');

    if (!content) return;

    const height = getHeight();

    setCollapseStyle({
      height,
      visibility: '',
    });

    nextFrame(() => {
      setCollapseStyle({
        height: getCollapseHeight(props),
        visibility: '',
      });
      onChangeCallback();
    });
  }

  function setExpanding() {
    console.log('setExpanding');

    nextFrame(() => {
      if (content) {
        const height = getHeight();

        setCollapseStyle({
          height,
          visibility: '',
        });
        onChangeCallback();
      }
    });
  }

  function setExpanded() {
    console.log('setExpanded');

    if (!content) return;

    setCollapseStyle({
      height: '',
      visibility: '',
    });
    onChangeCallback();
  }

  function getHeight() {
    return `${content.scrollHeight}px`;
  }

  function onTransitionEnd({ target, propertyName }) {
    console.log('onTransitionEnd', collapseState, propertyName);

    if (target === content && propertyName === 'height') {
      switch (collapseState) {
        case EXPANDING:
          setCollapseState(EXPANDED);
          break;
        case COLLAPSING:
          setCollapseState(COLLAPSED);
          break;
        // no default
      }
    }
  }

  function updateStyleStateFromCollapseState() {
    switch (collapseState) {
      case EXPANDING:
        setExpanding();
        break;
      case COLLAPSING:
        setCollapsing();
        break;
      case EXPANDED:
        setExpanded();
        break;
      case COLLAPSED:
        setCollapsed();
        break;
      // no default
    }
  }

  let style = {
    transition,
    ...collapseStyle,
  };

  console.log('render', style);

  //
  let didOpen = collapseState === EXPANDED || collapseState === EXPANDING;

  if (!didOpen && props.isOpen) {
    console.log('EXPANDING');
    setHasReversed(collapseState === COLLAPSING);
    setCollapseState(EXPANDING);
  }

  if (didOpen && !props.isOpen) {
    console.log('COLLAPSING');
    setHasReversed(collapseState === EXPANDING);
    setCollapseState(COLLAPSING);
  }

  const ElementType = elementType || 'div';
  const collapseClassName = `${className || 'collapse-css-transition'} --is-${collapseState}`;

  console.log('isOpen', isOpen);

  return (
    <ElementType ref={content} style={style} className={collapseClassName} onTransitionEnd={onTransitionEnd} {...attrs}>
      {typeof render === 'function' ? render(collapseState) : children}
    </ElementType>
  );
}

/*
function afterFrame(callback) {
  // https://nolanlawson.com/2018/09/25/accurately-measuring-layout-on-the-web/
  // https://github.com/andrewiggins/yield-to-browser
  requestAnimationFrame(() => setTimeout(callback, 0));
}
*/

function nextFrame(callback) {
  // Ensure it is always visible on collapsing
  requestAnimationFrame(() => requestAnimationFrame(callback));
}

function isMoving(collapseState) {
  return collapseState === EXPANDING || collapseState === COLLAPSING;
}

function getCollapseHeight(props) {
  return (props && props.collapseHeight) || '0px';
}

function getCollapsedVisibility(props) {
  return props.collapseHeight ? '' : 'hidden';
}
