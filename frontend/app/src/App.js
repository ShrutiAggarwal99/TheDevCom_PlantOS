import React, { Component } from 'react';
import './App.css';
import leaf from './healthy.jpg';
import Notifier from './components/Notifier';
import Canvas from './components/Canvas';
class App extends Component {
  constructor() {
    super();
    this.state = {
      offline: false
    }
  }

  componentDidMount() {
    window.addEventListener('online', () => {
      this.setState({ offline: false });
    });

    window.addEventListener('offline', () => {
      this.setState({ offline: true });
    });
  }

  componentDidUpdate() {
    let offlineStatus = !navigator.onLine;
    if (this.state.offline !== offlineStatus) {
      this.setState({ offline: offlineStatus });
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={leaf} className="App-logo" alt="Healthy Leaves" />
          <h1 className="App-title">Plant OS</h1>
        </header>
        <Notifier offline={this.state.offline} />
        <Canvas offline={this.state.offline} />
      </div>
    );
  }
}

export default App;