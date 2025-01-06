import { updateHistoryDisplay } from '../utils/ui.js';

export class History {
  constructor(container) {
    this.container = container;
    this.history = [];
  }

  addEntry(entry) {
    this.history.unshift(entry);
    if (this.history.length > 10) {
      this.history.pop();
    }
    this.render();
  }

  render() {
    updateHistoryDisplay(this.container, this.history);
  }

  loadHistory(history) {
    this.history = history || [];
    this.render();
  }
}