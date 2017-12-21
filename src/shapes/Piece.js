define("Piece", function() {
  function Piece(type, dms, point, shape, shapeDms, shapePt, shapeClr) {
    this.type = type;
    this.dms = dms;
    this.x = point.x || 0;
    this.y = point.y || 0;
    this.z = point.z || 0;
    this.shape = shape;
    this.shameDms = shapeDms;
    this.shapePt = shapePt;
    this.shapeClr = shapeClr;
    this.actionTime = 500;
  }
  Piece.prototype.moveBy = function(deltaX, deltaY, deltaZ) {
    // createjs.Tween.get(circle, { loop: true })
    // .to({ x: 400 }, 1000, createjs.Ease.getPowInOut(4))
    // .to({ alpha: 0, y: 175 }, 500, createjs.Ease.getPowInOut(2))
    // .to({ alpha: 0, y: 225 }, 100)
    // .to({ alpha: 1, y: 200 }, 500, createjs.Ease.getPowInOut(2))
    // .to({ x: 100 }, 800, createjs.Ease.getPowInOut(2));
    var props = ["x", "y", "z"];
    var dest = {
      x: this.x + (deltaX || 0),
      y: this.y + (deltaY || 0),
      z: this.z + (deltaZ || 0)
    };
    var self = this;
    self.dirty = 1;
    return new Promise(function(resolve, reject) {
      var count = 0;
      var total = 0;
      function done() {
        count += 1;
        if (count >= total) {
          self.dirty = 2;
          resolve(self);
        }
      }
      for (var i = 0; i < props.length; i += 1) {
        var prop = props[i];
        if (self[prop] !== dest[prop]) {
          console.log("change", prop, self[prop], dest[prop]);
          total += 1;
          var target = {};
          target[prop] = dest[prop];
          createjs.Tween.get(self)
            .to(target, self.actionTime, createjs.Ease.getPowInOut(4))
            .call(done);
        }
      }
      total += 1;
      createjs.Tween.get(self)
        .to({ z: 1 }, self.actionTime * 0.5, createjs.Ease.getPowIn(1))
        .to({ z: 0 }, self.actionTime * 0.5, createjs.Ease.getPowOut(1))
        .call(done);
    });
  };
  Piece.prototype.render = function(view) {
    var dms = this.dms - 2; // borders
    this.shapePt.x = dms * this.x;
    this.shapePt.y = dms * this.y;
    this.shapePt.z = dms * this.z;
    view.renderObject(this.shape, this.shapePt);
    if (this.dirty === 2) {
      this.dirty = 0; // so it waits till after the render.
    }
  };
  return Piece;
});
