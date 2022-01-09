// MIT License
// Copyright (c) 2021 Sujaykumar Hublikar <hello@sujaykumarh.com>

const cliSpinners = require("cli-spinners");
const inquirer = require("inquirer");

const DEFAULT_SPINNER = cliSpinners.dots2;

class Spinner {
  constructor(s) {
    this.spinner = s !== undefined ? s : DEFAULT_SPINNER;
    this.spinners = cliSpinners;
    this.frames = this.spinner.frames;
    this.interval = this.spinner.interval;
    this.i = 0;
    this.text = "";
  }

  setSpinner = (s) => {
    this.spinner = s !== undefined ? s : DEFAULT_SPINNER;
    this.frames = this.spinner.frames;
    this.interval = this.spinner.interval;
    this.i = 0;
  };

  start = (text) => {
    this.text = (text) ? text : "Please wait...";
    console.log("");
    
    // create a new spinner if not already created
    if (!this.ui){
      this.ui = new inquirer.ui.BottomBar({
        bottomBar: this.spinner.frames[this.i % this.spinner.frames.length],
      });
    }

    // if spinner is already created, clear it
    if (this.spinnerFun) {
      clearInterval(this.spinnerFun);
    }

    // start the spinner
    this.spinnerFun = setInterval(() => {
      this.ui.updateBottomBar(
        this.frames[this.i++ % this.frames.length] + " " + this.text
      );
    }, this.spinner.interval);
  };

  stop = (text) => {
    clearInterval(this.spinnerFun);
    this.text = (text) ? text : "Done!";
    this.ui.updateBottomBar(`${this.text}\n`);
  };
}

exports.Spinner = new Spinner();
