/**
 * Used to calculate damage during an attack
 * @param  {Object} attackingObject
 * @param  {Object} defendingObject
 */

function calculateDamage(attackingObject, defendingObject) {
	attackingObject.attackAnimation.x = defendingObject.animations.x - defendingObject.spriteSheet._frameWidth / 2;
	attackingObject.attackAnimation.y = defendingObject.animations.y;
	renderer.activeObjectsContainer.addChild(attackingObject.attackAnimation);
	attackingObject.attackAnimation.gotoAndPlay("slash");

	defendingObject.receiveDamage(attackingObject);

	setTimeout(function() {
		renderer.activeObjectsContainer.removeChild(attackingObject.attackAnimation)
	}, 500);
}