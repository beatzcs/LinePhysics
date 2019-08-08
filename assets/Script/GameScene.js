cc.Class({
    extends: cc.Component,

    properties: {
        linePrefab: cc.Prefab,
        linePhysics: cc.Graphics
    },

    onLoad: function () {
        var manager = cc.director.getPhysicsManager();
        manager.enabled = true;
        manager.debugDrawFlags = 0;
    },

    start: function () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStartCallback, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoveCallback, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEndCallback, this);
    },

    onTouchStartCallback: function (event) {
        console.log("touch start ... ");
        let pos = this.node.convertToNodeSpaceAR(event.getLocation());
        this.linePhysics.moveTo(pos.x, pos.y);
        this.recordPos = cc.v2(pos.x, pos.y);
    },

    onTouchMoveCallback: function (event) {
        let pos = this.node.convertToNodeSpaceAR(event.getLocation());
        this.linePhysics.lineTo(pos.x, pos.y);
        this.linePhysics.stroke();
        this.linePhysics.moveTo(pos.x, pos.y);

        // 记录当前手移动到的点
        this.currentPos = cc.v2(pos.x, pos.y);
        //求两点之间的距离
        let subVec = this.currentPos.subSelf(this.recordPos);
        let distance = subVec.mag() + 5;
        // 如果距离大于一定值，这里的25是预制体的width
        if (distance >= 25) {
            // 给定方向向量
            let tempVec = cc.v2(0, 10);
            // 求两点的方向角度
            let rotateVec = subVec.signAngle(tempVec) / Math.PI * 180 - 90;
            // 创建预制体
            let lineItem = cc.instantiate(this.linePrefab);
            lineItem.rotation = rotateVec;
            lineItem.parent = this.node;
            // 这一步是为了防止两个线段之间出现空隙，动态改变预制体的长度
            lineItem.setPosition(pos.x, pos.y);
            lineItem.width = distance;
            lineItem.getComponent(cc.PhysicsBoxCollider).offset.x = -lineItem.width / 2
            //cc.log(lineItem.getComponent(cc.PhysicsBoxCollider).size);
            //cc.log(lineItem.getComponent(cc.PhysicsBoxCollider).size.width, lineItem.width);
            lineItem.getComponent(cc.PhysicsBoxCollider).size.width = lineItem.width;
            lineItem.getComponent(cc.PhysicsBoxCollider).apply();
            // 将此时的触摸点设为记录点
            this.recordPos = cc.v2(pos.x, pos.y);
        }
    },

    onTouchEndCallback: function (event) {
        console.log("touch end ... ");
    },

    onDestroy: function () {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStartCallback, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoveCallback, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEndCallback, this);
    }
});