const {ccclass, property} = cc._decorator;
import {GameOver} from './GameOver';
import {RockSpawner} from './RockSpawner';
@ccclass
export class StartButton extends cc.Component {
    
    @property(GameOver)
    gameOverUI: GameOver = null;

    @property(RockSpawner)
    rockSpawner: RockSpawner = null;

    startButton(){
        if (!this.gameOverUI.madePersistent){
            this.gameOverUI.madePersistent = true;
            cc.game.addPersistRootNode(this.gameOverUI.node);
        }

        this.rockSpawner.garbageDay();
        cc.director.loadScene('Scene/GameScene');
    }
    start(){
        cc.director.getCollisionManager().enabled = true;
        this.gameOverUI.node.active = false;
        this.rockSpawner.createRock(true);
        this.rockSpawner.createRock(true);
        this.rockSpawner.createRock(true);
        this.rockSpawner.createRock(true);
        this.rockSpawner.createRock(true);
    }
}
