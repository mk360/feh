export default class FpsText extends Phaser.GameObjects.Text {
  constructor(scene) {
    super(scene, 100, 100, '', { color: 'cyan', fontSize: '28px' })
    scene.add.existing(this)
    this.setOrigin(0)
    // this.setText(`fps: ${Math.floor(this.scene.game.loop.actualFps)}`)
  }

  preUpdate() {

  }

  public update() {
    this.setText(`fps: ${Math.floor(this.scene.game.loop.actualFps)}`)
  }
}
