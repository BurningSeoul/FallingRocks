const {ccclass, property} = cc._decorator;
import {RockSpawner} from './RockSpawner';
import {GameOver} from './GameOver';
@ccclass
export class Game extends cc.Component {

    @property(RockSpawner)
    rockFactory: RockSpawner = null;

    @property(GameOver)
    gameOverUI: GameOver = null;
    
    @property
    playerHP: number = 3;

    @property
    score: number = 0;

    @property
    speedMultiplier: number = 1;

    @property
    rotationMultiplier: number = 10;

    @property
    gameOver: boolean = false;

    @property
    spawnRock: boolean = false;

    @property(cc.Animation)
    anim: cc.Animation = null;

    @property ([cc.Sprite])
    livesUI: cc.Sprite[] = [];
    
    @property (cc.Label)
    scoreUI: cc.Label = null;

    //internal timer that keeps new rocks from spawning at the same time as recycled rocks
    private newRockTimer: number = 2;   //first rock will spawn immediately
    private newGame: boolean = true;
    private startingRocks: number = 3;

    increaseScore (){
        this.score += 1;
        this.scoreUI.string = "Score: " + this.score.toString();
        
        //Every 20 points we spawn an additional rock
        if(this.score % 20 == 0){
            this.spawnRock = true;
        }
        //Every 10 points we increase the speed of the rocks
        if (this.score % 10 == 0){
            this.rockFactory.increaseSpeed(this.speedMultiplier, this.rotationMultiplier);
        }

        //Bonus HP 
        if(this.score % 100 == 0){
            if(this.playerHP < 3){
                this.anim = this.livesUI[this.playerHP].getComponent(cc.Animation);
                this.playerHP+= 1;
                this.anim.play("Full");
            }
        }
    }

    decreaseHP(){
        this.playerHP -= 1;
        if(this.playerHP <= 0){
            this.playerHP = 0;
        }
        this.anim = this.livesUI[this.playerHP].getComponent(cc.Animation);
        this.anim.play("Empty");

        if(this.playerHP <= 0){
            this.gameOverUI.score = this.score;
            this.gameOver = true;
        }
    }

    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        cc.director.getCollisionManager().enabled = true;
        this.gameOverUI = cc.find('GameOver').getComponent('GameOver');
        this.gameOverUI.node.active = false;
    }

    update (dt) {
        if(this.spawnRock || this.newGame){
            this.newRockTimer += dt;
        }
        //GAME ON
        if(!this.gameOver){
            //Additional Rocks are dependent on timer + score
            if(this.newRockTimer > 2){
                this.rockFactory.createRock(false);
                this.newRockTimer = 0;
                this.spawnRock = false;

                if(this.startingRocks > 1){
                    this.startingRocks -= 1;
                } else {
                    this.newGame = false;
                }
            }
        //GAME OVER MAN
        } else {
            this.gameOverUI.node.active = true;
            this.rockFactory.garbageDay();
            
            cc.director.loadScene('Scene/GameOver');
        }
    }
}
