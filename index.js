import React, { Component } from 'react';
import { render } from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import {ButtonToolbar, MenuItem, DropdownButton, Dropdown} from 'react-bootstrap';

class Box extends Component {
  selectBox = () => {
    this.props.selectBox(this.props.row, this.props.col);
  }
  render() {
    return(
      <div
        className={this.props.boxClass}
        id={this.props.id}
        onClick={this.selectBox}
      />
    )
  }
}

class Grid extends Component {
  render(){
    const width = this.props.cols * 14;
    var rowsArr = [];

    var boxClass = "";
    for(let i = 0; i < this.props.rows; i++){
      for(let j = 0; j < this.props.cols; j++){
        let boxId = i + "_" + j;

        boxClass = this.props.gridFull[i][j] ? "box on" : "box off";
        rowsArr.push(
          <Box
            boxClass={boxClass}
            key={boxId}
            boxId={boxId}
            row={i}
            col={j}
            selectBox={this.props.selectBox}
          />
        )
      }
    }

    return (
      <div className="grid" style={{width: width}}>
        {rowsArr}
      </div>
    )
  }
}

class Buttons extends Component {

  handleSelect = (evt) => {
    this.props.gridSize(evt);
  }

  render() {
    return (
      <div className="center">
        <ButtonToolbar>
          <button className="btn btn-light" onClick={this.props.playButton}>
            Play
          </button>
          <button className="btn btn-light" onClick={this.props.pauseButton}>
            Pause
          </button>
          <button className="btn btn-light" onClick={this.props.clear}>
            Clear
          </button>
          <button className="btn btn-light" onClick={this.props.slow}>
            Slow
          </button>
          <button className="btn btn-light" onClick={this.props.fast}>
            Fast
          </button>
          <button className="btn btn-light" onClick={this.props.seed}>
            Seed
          </button>
          <DropdownButton
            title="Grid size"
            id="size-menu"
            onSelect={this.handleSelect}
          >
            <Dropdown.Item eventKey="1">20x10</Dropdown.Item>
            <Dropdown.Item eventKey="2">50x30</Dropdown.Item>
            <Dropdown.Item eventKey="3">70x50</Dropdown.Item>
          </DropdownButton>
        </ButtonToolbar>
      </div>
    )
  }
}

class Main extends Component {

  constructor(){
    super();
    this.speed = 150;
    this.rows = 30;
    this.cols = 50;

    this.state = {
      generation: 0,
      gridFull: this.emptyGrid(),
    }
  }

  emptyGrid = () => {
    return Array(this.rows).fill().map(() => Array(this.cols).fill(false));
  }

  gridSize = (index) => {
    let tmp = {
      "1": {rows: 20, cols: 10},
      "2": {rows: 50, cols: 30},
      "3": {rows: 70, cols: 50},
    }

    [this.rows, this.cols] = tmp[index-1];

    this.clear();
  }

  selectBox = (row, col) => {
    let gridCopy = arrayClone(this.state.gridFull);
    gridCopy[row][col] = !gridCopy[row][col];

    this.setState({
      gridFull: gridCopy
    });
  }

  seed = () => {
    let gridCopy = arrayClone(this.state.gridFull);

    for(let i = 0; i < this.rows; i++){
      for(let j = 0; j < this.cols; j++){
        if(Math.floor(Math.random() * 4) === 1){
          gridCopy[i][j] = true;
        }
      }
    }

    this.setState({
      gridFull: gridCopy
    });
  }

  playButton = () => {
    clearInterval(this.intervarId);
    this.intervalId = setInterval(this.play, this.speed);
  }

  pauseButton = () => {
    clearInterval(this.intervalId);
  }

  slow = () => {
    this.speed = 1000;
    this.playButton();
  }

  fast = () => {
    this.speed = 100;
    this.playButton();
  }

  clear = () => {
    this.setState({
      gridFull: this.emptyGrid(),
      generation: 0,
    });
  }

  play = () => {
    let g = this.state.gridFull;
    let g2 = arrayClone(this.state.gridFull);

    for(let i = 0; i < this.rows; i++){
      for(let j = 0; j < this.cols; j++){
        let count = 0;
        if(i > 0) if(g[i - 1][j]) count++;
        if(i > 0 &&  j > 0) if(g[i - 1][j - 1]) count++;
        if(i > 0 && j < this.cols - 1) if(g[i - 1][j + 1]) count++;
        if(j < this.cols - 1) if(g[i][j + 1]) count++;
        if(j > 0) if(g[i][j - 1]) count++;
        if(i < this.rows - 1) if(g[i + 1][j]) count++;
        if(i < this.rows - 1 && j > 0) if(g[i + 1][j - 1]) count++;
        if(i < this.rows - 1 && j < this.cols - 1) if(g[i + 1][j + 1]) count++;
        if(g[i][j] && (count < 2 || count > 3)) g2[i][j] = false;
        if(!g[i][j] && count === 3) g2[i][j] = true; 
      }
    }

    this.setState({
      gridFull: g2,
      generation: this.state.generation + 1,
    });
  }

  componentDidMount(){
    this.seed();
    //this.playButton();
  }

  render() {
    return (
      <div>
        <h1>The Game of Life</h1>
        <Buttons
          playButton={this.playButton}
          pauseButton={this.pauseButton}
          slow={this.slow}
          fast={this.fast}
          clear={this.clear}
          seed={this.seed}
          gridSize={this.gridSize}
        />
        <Grid
          gridFull={this.state.gridFull}
          rows={this.rows}
          cols={this.cols}
          selectBox={this.selectBox}
        />
        <h2>Generations: {this.state.generation}</h2>
      </div>
    )
  }
}

function arrayClone(arr){
  return JSON.parse(JSON.stringify(arr));
}

render(<Main />, document.getElementById('root'));