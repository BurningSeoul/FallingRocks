const {ccclass, property} = cc._decorator;

@ccclass
export class GameOver extends cc.Component {

    @property(cc.Label)
    finalScore: cc.Label = null;

    @property
    madePersistent: boolean = false;

    @property
    score: number = 0;

    resetGame(){
        this.score = 0;
        cc.director.loadScene('Scene/GameScene');
    }

    onEnable(){
        this.finalScore.string = this.score.toString();
    }
}
