const {ccclass, property} = cc._decorator;
import {Game} from './Game';
import { RockSpawner } from './RockSpawner';

@ccclass
export class Rock extends cc.Component {

    @property
    speed: number = 0;

    @property
    rotationSpeed: number = 0;

    @property
    accelY: number = 0;

    @property(Game)
    game: Game = null;

    @property
    collider: cc.CircleCollider = null;

    @property(cc.Prefab)
    lavaP: cc.Prefab = null;

    @property(cc.Prefab)
    clickP: cc.Prefab = null;

    private rockFactory: RockSpawner;
    private fallAction: cc.Action;
    private isTitleRock: boolean = false;

    init(accelY: number,spd: number, rockFactory: RockSpawner, titleScreen: boolean){
        this.accelY = accelY;
        this.speed = spd;
        this.rotationSpeed = this.rotationDirection();
        this.rockFactory = rockFactory;

        if(!titleScreen){
            this.game = cc.find('Canvas').getComponent('Game');  //Dependancy Init
            //Add touch event -> player input
            this.node.on(cc.Node.EventType.TOUCH_START, this._onRockClick, this);
        } else {
            this.isTitleRock = true;
        }
    }

    rotationDirection(){
        let rand0 =  cc.randomMinus1To1();
        if(rand0 >= 0){
            rand0 = 1
        } else {
            rand0 = -1;
        }
         rand0 = rand0 * (this.speed * 3 + 15);
        return rand0;
    }
    _onRockClick(){
        //Particle Effects
        let pSystem = null;
        pSystem = cc.instantiate(this.clickP);
        pSystem.parent = this.node.parent;
        pSystem.setPosition(this.node.getPosition());

        this.game.increaseScore();
        this.onDestroyRock();
    }

    fallingRock(dt: number){
        let fallSpeed = 1/(this.speed * dt);
        let fall = cc.moveBy(fallSpeed, cc.p(0,this.accelY));

        let rot = cc.rotateBy(1,this.rotationSpeed);
        return cc.sequence(rot, fall);
    }

    onDestroyRock(){
        this.node.off(cc.Node.EventType.TOUCH_START, this._onRockClick, this);
        this.node.stopAllActions(); // Reset actions for lava hitting effect
        this.accelY = 0;
        this.speed = 0;
        this.rotationSpeed = 0;
        this.rockFactory.rockPool.put(this.node);
        this.rockFactory.createRock(this.isTitleRock);
    }

    // LIFE-CYCLE CALLBACKS:
    update (dt) {
        //Every frame we add an additional action to the rock to simulate acceleration
        this.fallAction = this.fallingRock(dt);
        this.node.runAction(this.fallAction);
    }

    onCollisionEnter(other, self){

        if(other.node.groupIndex == 3){
            //TitleScreen
        } else{ 
        //Particle Effects
        let pSystem = null;
        pSystem = cc.instantiate(this.lavaP);
        pSystem.parent = this.node.parent;
        pSystem.setPosition(this.node.getPosition());
        
        this.node.off(cc.Node.EventType.TOUCH_START, this._onRockClick, this);
        this.node.stopAllActions();
        this.speed = 1;
        this.game.decreaseHP();
        }
    }

    //Wait to destroy the rock so that it can sink into 'lava'
    onCollisionExit(other,self){
        this.onDestroyRock();
    }
}
