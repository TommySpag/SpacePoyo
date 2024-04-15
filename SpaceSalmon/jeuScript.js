const resolutionX=1000;
const resolutionY=800;
var tileSizeX = 128;
var tileSizeY = 128;
 
var groundTiles;
var playerTankSprite;
var playerOffsetX = (resolutionX / 2 - 24);
var playerOffsetY = (resolutionY / 2 - 24);
 
const app = new PIXI.Application({ width: resolutionX, height: resolutionY, backgroundColor: 0x1099bb });
 
 
document.getElementById("pixie-container").appendChild(app.view);
const texturePromise=PIXI.Assets.load("imgs/tile.png");
 
texturePromise.then((texturePromise)=>{
var groundTiles = new PIXI.tilemap.CompositeRectTileLayer(0, PIXI.utils.TextureCache['imgs/imgGround.png']);
app.stage.addChild(groundTiles);
 
 
for (var i = 0; i <= parseInt(resolutionX / tileSizeX); i++) {
    for (var j = 0; j <= parseInt(resolutionX / tileSizeX); j++) {
        groundTiles.addFrame('imgs/tile.png', i * tileSizeX, j * tileSizeY);
    }
}
const tanksPromise=PIXI.Assets.load("imgs/salmon.png");
 
tanksPromise.then((tanksPromiseReceived)=>{
    var tankTexture = new PIXI.Texture(
        PIXI.utils.TextureCache['imgs/salmon.png'],
       
    );
    playerTankSprite = new PIXI.Sprite(tankTexture);
    playerTankSprite.x = playerOffsetX;
    playerTankSprite.y = playerOffsetY;
    app.stage.addChild(playerTankSprite);
})
 
})