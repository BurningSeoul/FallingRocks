const {ccclass, property} = cc._decorator;

@ccclass
export class RockSpawner extends cc.Component {

    @property(cc.Node)
    gameNode: cc.Node = null;

    @property(cc.Prefab)
    rockPrefab: cc.Prefab = null;

    @property
    maxRocks: number = 10;

    @property
    maxPosX: number = 0;

    @property
    paddingX: number = 0;

    @property
    accelY: number = 0;

    @property
    speed: number = 0;

    @property
    rotationSpeed: number = 0;

    @property
    canSpawnRocks: boolean = true;

    @property
    _rockPool: cc.NodePool = null;

    @property
    get rockPool() {
        return this._rockPool;
    }

    createRock(titleScreen: boolean){
        if(this.canSpawnRocks){
            let rock = null;
            let variantSpeed = cc.randomMinus1To1() + this.speed; 

            //allows more variety at higher speeds
            if(variantSpeed > 5){
                variantSpeed = cc.random0To1() * variantSpeed;
            }
            //sets a minimum speed
            if(variantSpeed < 1){
                variantSpeed = 1;
            }
            if(this._rockPool.size() > 0){
                rock = this._rockPool.get(this);
            } else{
                rock = cc.instantiate(this.rockPrefab);
            }
            rock.parent = this.node;
            rock.setPosition(this.getNewSpawnLocation());
            rock.rotation = this.getRandomRotation();
            rock.getComponent('Rock').init(this.accelY,variantSpeed,this,titleScreen);
        }
    }

    //Returns a point above the screen, but within the x boundaries
    getNewSpawnLocation() {
        let randX = 0;
        this.maxPosX = this.gameNode.width/2 - this.paddingX;
        randX = cc.randomMinus1To1() * this.maxPosX;
        return cc.p(randX, this.node.anchorY);
    }

    getRandomRotation(){
        let rand0 = 0;
        rand0 = cc.random0To1() * 360;
        return rand0;
    }

    increaseSpeed(spd: number, rotSpd: number){
        this.speed += spd;
        this.rotationSpeed += rotSpd;
    }

    //Memory Management required for pooling
    garbageDay(){
        this.canSpawnRocks = false;
        this.node.destroyAllChildren();
        this._rockPool.clear();
        
    }

    // LIFE-CYCLE CALLBACKS:
     onLoad () {
         //Pool initialization
        this._rockPool = new cc.NodePool();
        let initCount = this.maxRocks;
        for (let i = 0; i < initCount; ++i){
            let rock = cc.instantiate(this.rockPrefab);
            this._rockPool.put(rock);
        }
     }
}
