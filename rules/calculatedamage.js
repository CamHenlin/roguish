/**
 * Used to calculate damage during an attack
 * @param  {Object} attackingObject
 * @param  {Object} defendingObject
 */

function calculateDamage(attackingObject, defendingObject) {
	//attacking Object attacks a number of times equal to their attack speed
	for (var i = 0; i < attackingObject.attackSpeed; i++){
		if (attackingObject instanceof Player ){
			attackingObject.attackAnimation.x = defendingObject.animations.x - defendingObject.spriteSheet._frameWidth / 2;
			attackingObject.attackAnimation.y = defendingObject.animations.y;
			renderer.activeObjectsContainer.addChild(attackingObject.attackAnimation);
			attackingObject.attackAnimation.gotoAndPlay("slash");
		}

		if (defendingObject.hp > 0){
			defendingObject.receiveDamage(attackingObject);
		}

		if (attackingObject instanceof Player ){
			setTimeout(function() {
				renderer.activeObjectsContainer.removeChild(attackingObject.attackAnimation)
			}, 500);
		}

	}
}