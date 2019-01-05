import './app.scss';
import React from 'react';
import Collapse from 'components/Collapse/Collapse';
import cx from 'classnames';

class App extends React.Component {
  state = {
    isOpen1: false,
    isOpen2: false,
    isOpen3: false,
    spy1: { collapse: null, collapseStyle: { maxHeight: null, visibility: null }, transition: null },
  };

  render() {
    return (
      <div className="app">
        <pre style={{ fontSize: '10px', width: '100%' }}>{JSON.stringify(this.state.spy1, null, 1)}</pre>
        <button className="app__toggle" onClick={() => this.toggle(1)}>
          <span className="app__toggle-text">toggle</span>
          <div className="rotate90">
            <svg
              className={cx('icon', { 'icon--expanded': this.state.isOpen1 })}
              viewBox="6 0 12 24"
              width="16px"
              height="16px"
            >
              <title>toggle</title>
              <polygon points="8 0 6 1.8 14.4 12 6 22.2 8 24 18 12" />
            </svg>
          </div>
        </button>
        <Collapse
          isOpen={this.state.isOpen1}
          transition="max-height 280ms ease-in-out"
          classNameAppend={
            'app__collapse app__collapse--gradient ' + (this.state.isOpen1 ? 'app__collapse--active' : '')
          }
          onChange={state => this.setState({ spy1: state })}
        >
          <div className="app__content">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat. <button>click</button>
            <img className="image" alt="random" src="https://source.unsplash.com/user/erondu/320x180" />
          </div>
        </Collapse>

        <button className="app__toggle" onClick={() => this.toggle(2)}>
          toggle
        </button>

        <Collapse
          isOpen={this.state.isOpen2}
          classNameAppend={
            'app__collapse app__collapse--gradient ' + (this.state.isOpen2 ? 'app__collapse--active' : '')
          }
          transition="max-height 800ms cubic-bezier(0.4, 0, 0.2, 1)"
          aria-hidden={this.state.isOpen2 ? 'false' : 'true'}
          elementType="article"
          render={collapse => (
            <React.Fragment>
              <div className="app__content">
                <div>{JSON.stringify(collapse)}</div>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat. <button>click</button>
                <img className="image" alt="random" src="https://source.unsplash.com/user/erondu/320x180" />
              </div>
            </React.Fragment>
          )}
        />

        <button className="app__toggle" onClick={() => this.toggle(3)}>
          toggle
        </button>

        <Collapse
          isOpen={this.state.isOpen3}
          collapseHeight="70px"
          classNameAppend={
            'app__collapse app__collapse--gradient ' + (this.state.isOpen3 ? 'app__collapse--active' : '')
          }
          render={collapse => (
            <div className="app__content">
              <div>{JSON.stringify(collapse)}</div>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat. <button>click</button>
            </div>
          )}
        />
      </div>
    );
  }

  toggle = index => {
    let collapse = 'isOpen' + index;

    this.setState(prevState => ({ [collapse]: !prevState[collapse] }));
  };
}

export default App;
