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
    onInit, // exclude from attrs
    onChange, // exclude from attrs
    isOpen, // exclude from attrs
    ...attrs
  } = props;

  const contentRef = useRef(null);
  const [collapseState, setCollapseState] = useState(props.isOpen ? EXPANDED : COLLAPSED);
  const [collapseStyle, setCollapseStyle] = useState({
    height: props.collapseHeight || '0px',
    visibility: props.collapseHeight ? '' : 'hidden',
  });
  const [hasReversed, setHasReversed] = useState(false);

  useEffect(function didMount() {
    console.log('componentDidMount');

    if (collapseState === EXPANDED) setExpanded();

    onCallback(props.onInit);
  }, []);

  useLayoutEffect(
    function didUpdate() {
      console.log('componentDidUpdate');

      if (!contentRef.current) return;

      console.log('componentDidUpdate - real work');

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
    },
    [collapseState]
  );

  function onCallback(callback) {
    console.log('onCallback');

    callback &&
      callback({
        collapseState,
        collapseStyle,
        hasReversed,
        isMoving: isMoving(collapseState),
      });
  }

  function getCollapseHeight() {
    return (props && props.collapseHeight) || '0px';
  }

  function getCollapsedVisibility() {
    return props.collapseHeight ? '' : 'hidden';
  }

  function setCollapsed() {
    console.log('setCollapsed');

    if (!contentRef.current) return;

    setCollapseStyle({
      height: getCollapseHeight(),
      visibility: getCollapsedVisibility(),
    });
    onCallback(props.onChange);
  }

  function setCollapsing() {
    console.log('setCollapsing');

    if (!contentRef.current) return;

    const height = getContentHeight(); // capture height before setting it to async setState method

    setCollapseStyle({
      height,
      visibility: '',
    });

    nextFrame(() => {
      setCollapseStyle({
        height: getCollapseHeight(),
        visibility: '',
      });
      onCallback(props.onChange);
    });
  }

  function setExpanding() {
    console.log('setExpanding');

    nextFrame(() => {
      if (contentRef.current) {
        const height = getContentHeight(); // capture height before setting it to async setState method

        setCollapseStyle({
          height,
          visibility: '',
        });
        onCallback(props.onChange);
      }
    });
  }

  function setExpanded() {
    console.log('setExpanded');

    if (!contentRef.current) return;

    setCollapseStyle({
      height: '',
      visibility: '',
    });
    onCallback(props.onChange);
  }

  function getContentHeight() {
    return `${contentRef.current.scrollHeight}px`;
  }

  function onTransitionEnd({ target, propertyName }) {
    console.log('onTransitionEnd', collapseState, propertyName);

    if (target === contentRef.current && propertyName === 'height') {
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

  // getDerivedStateFromProps
  let didOpen = collapseState === EXPANDED || collapseState === EXPANDING;

  if (!didOpen && props.isOpen) {
    setHasReversed(collapseState === COLLAPSING);
    setCollapseState(EXPANDING);
  }
  if (didOpen && !props.isOpen) {
    setHasReversed(collapseState === EXPANDING);
    setCollapseState(COLLAPSING);
  }
  // END getDerivedStateFromProps

  const style = {
    transition,
    ...collapseStyle,
  };
  const ElementType = elementType || 'div';
  const collapseClassName = `${className || 'collapse-css-transition'} --is-${collapseState}`;

  return (
    <ElementType
      ref={contentRef}
      style={style}
      className={collapseClassName}
      onTransitionEnd={onTransitionEnd}
      {...attrs}
    >
      {typeof render === 'function' ? render(collapseState) : children}
    </ElementType>
  );
}

function nextFrame(callback) {
  // Ensure it is always visible on collapsing, afterFrame didn't work
  requestAnimationFrame(() => requestAnimationFrame(callback));
}

function isMoving(collapseState) {
  return collapseState === EXPANDING || collapseState === COLLAPSING;
}
