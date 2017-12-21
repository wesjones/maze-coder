define('Group', function() {
    function Group(dms, point) {
        this.x = point.x;
        this.y = point.y;
        this.z = point.z;
        this.parts = this.parts || [];
    }
    Group.prototype.add = function(name, part) {
        this.parts[name] = part;
        this.parts.push(part);
    };
    Group.prototype.moveBy = function(deltaX, deltaY, deltaZ) {
        this.dirty = true;
        return new Promise(function(resolve, reject) {
            setTimeout(resolve);
        });
    };
    Group.prototype.render = function(view) {
        for(var i = 0; i < this.parts.length; i += 1) {
            this.parts[i].render(view);
        }
        if (this.dirty === 2) {
            this.dirty = 0;// so it waits till after the render.
        }
    };

    return Group;
});