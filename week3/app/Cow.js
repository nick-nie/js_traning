"use strict";
export default class Cow {

  constructor(name) {
    this.name = name || "Anon    elllvooo cow";
  }

  greets(target) {
    if (!target)
      throw new Error("missing target");
    return this.name + " greets " + target;
  }

}