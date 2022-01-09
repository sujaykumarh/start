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
    console.log("");
    
    if (!this.ui)
      this.ui = new inquirer.ui.BottomBar({
        bottomBar: this.spinner.frames[this.i % this.spinner.frames.length],
      });

    this.text = text;
    if (!this.spinnerFun) {
      this.spinnerFun = setInterval(() => {
        this.ui.updateBottomBar(
          this.frames[this.i++ % this.frames.length] + " " + this.text
        );
      }, this.spinner.interval);
    }
  };

  stop = (text) => {
    this.text = text;
    this.ui.updateBottomBar(`${this.text}\n`);
    clearInterval(this.spinnerFun);
  };
}

exports.Spinner = new Spinner();
