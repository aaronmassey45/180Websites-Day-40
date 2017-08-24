import React, { Component } from 'react';
import {Button} from 'react-bootstrap';
import Navbar from '../containers/navbar';
import Circle from '../containers/circle';
import Count from '../containers/count';

export default class App extends Component {
  constructor() {
    super();

    this.state = {
      gameStart: false,
      user: [],
      sequence: [],
      count: 0,
      clicks: 0,
      isStrict: false,
      userTurn: false
    }
  }

  start() {
    let {sequence} = this.state;
    sequence = generateArray(sequence);
    console.log(sequence);
    this.setState({ sequence, gameStart: true, count: 1 }, () => {
      this.aiTurn(0);
    });
  }

  strict() {
    this.setState({ isStrict: !this.state.isStrict })
  }

  renderCircle(color, i) {
    return (
      <Circle color={color}
        onClick={() => this.handleClick(i, color)}
      />
    );
  }

  handleClick(i, color) {
    let {clicks, gameStart, userTurn} = this.state;
    if (gameStart && userTurn) {
      clicks++;
      this.isCorrect(clicks, i);
      setColor(color, 200);
    }
  }

  aiTurn(i) {
    this.setState({ userTurn: false})
    let {count, sequence} = this.state;
    let time;
    let color;
    if (count < 4) {
        time = 1000;
    } else if (count < 8) {
        time = 850;
    } else if (count < 12) {
        time = 700;
    } else {
        time = 550;
    }
    if (sequence[i] === 1) {
        color = 'red';
    } else if (sequence[i] === 2) {
        color = 'blue';
    } else if (sequence[i] === 3) {
        color = 'yellow';
    } else if (sequence[i] === 4) {
        color = 'green';
    }

    setTimeout(() => {
      setColor(color, time);
      play(sequence[i]);
      if (i < count - 1) {
        i++;
        this.aiTurn(i);
      } else {
        this.setState({ userTurn: true })
      }
    }, time*1.5);
  }

  isCorrect(clicks, i) {
    let {user, count, sequence, isStrict} = this.state;
    if (i === sequence[clicks - 1] && clicks === count) {
      //if user presses button and current sequence is over
      play(i);
      if (count > 19) {
        // if user game is won, end and restart
        alert("You win!");
        clicks = 0;
        user = [];
        this.setState({ clicks, user }, () => {
          this.start();
        })
      } else {
        // if game is not won, repeat sequence with addition step
        count++;
        clicks = 0;
        user = [];
        this.setState({ count, clicks, user }, () => {
          this.aiTurn(0);
        })
      }
    } else if (i !== sequence[clicks - 1]) {
      //if user presses wrong buttton
      play(5);
      if (isStrict === true) {
        //if strict, restart whole game with new sequence
        clicks = 0;
        user = [];
        this.setState({ clicks, user }, () => {
          this.start();
        })
      } else if (isStrict === false) {
        // replay sequence
        clicks = 0;
        user = [];
        this.setState({ clicks, user }, () => {
          this.aiTurn(0);
        })
      }
    } else {
      play(i);
      this.setState({ clicks })
    }
  }

  render() {
    let begin = this.state.gameStart ? 'Restart' : 'Start';
    let strict = this.state.isStrict ? 'On' : 'Off';
    let style = this.state.isStrict ? 'danger' : 'success';
    return (
      <div className="App text-center">
        <Navbar />
        <h1 className='animated fadeIn'>Simon!</h1>
        <Button bsStyle='info' onClick={this.start.bind(this)}>{begin}</Button>
        <Button bsStyle={style} onClick={this.strict.bind(this)}>Strict Mode: {strict}</Button>
        <Count count={this.state.count} />
        <div className="container">
          <br/>
          <div className="colors">
            {this.renderCircle('red', 1)}
            {this.renderCircle('blue', 2)}
            <div className="clearfix"></div>
            {this.renderCircle('yellow', 3)}
            {this.renderCircle('green', 4)}
          </div>
        </div>
      </div>
    );
  }
}

function play(i) {
  let src;
  if (i === 1) {
    src = "https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"
  } else if (i === 2) {
    src = "https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"
  } else if (i === 3) {
    src = "https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"
  } else if (i === 4) {
    src = "https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"
  } else {
    src = "http://free-sounds.net/sound-files/special-effects/SHATTERE.WAV"
  }
  var snd = new Audio(src);
  return snd.play();
}

function generateArray(arr) {
  arr = [];
  for (var i = 0; i < 20; i++) {
    arr.push(Math.floor(Math.random()*4+1))
  }
  return arr;
}

function setColor(color, time) {
  document.querySelector(`#${color}`).style.cssText += `background-color: ${color}; opacity: 1`;
  setTimeout(() => {
    document.querySelector(`#${color}`).style.cssText += `background-color: transparent; opacity: .6`
  }, time)
}
