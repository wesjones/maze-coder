// define('Panda', ['Group', 'Piece'], function(Group, Piece) {
//     function Panda(dms, point) {
//         Group.call(this, dms, point);
//         this.add('feet', new Feet(dms, point, obelisk.ColorPattern.BLACK));
//     }
//     Panda.prototype = Group.prototype;

//     function Feet(dms, point, color) {
//         var fdms = Math.round(dms * 0.6);
//         var cubeDms = new obelisk.CubeDimension(fdms, fdms, Math.round(dms*0.1));
//         var cbColor = new obelisk.CubeColor().getByHorizontalColor(color);
//         var cube = new obelisk.Cube(cubeDms, cbColor);
//         var cubePt = new obelisk.Point3D((dms - 2) * point.x, (dms - 2) * point.y, (dms - 2) * point.z);
//         Piece.call(this, 'feet', dms, point, cube, cubeDms, cubePt, cbColor);
//     }
//     Feet.prototype = Piece.prototype;

//     return Panda;
// });