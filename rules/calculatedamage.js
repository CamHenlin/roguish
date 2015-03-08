/**
 * Used to calculate damage during an attack
 * @param  {Object} attackingObject
 * @param  {Object} defendingObject
 */

function calculateDamage(attackingObject, defendingObject) {
	// stupid hack
	attackingObject.attackAnimation.x = defendingObject.x - 8;
	attackingObject.attackAnimation.y = defendingObject.y;
	renderer.activeObjectsContainer.addChild(attackingObject.attackAnimation);
	attackingObject.attackAnimation.gotoAndPlay("slash");
	setTimeout(function() {
		renderer.activeObjectsContainer.removeChild(attackingObject.attackAnimation)}, 500);

	defendingObject.receiveDamage(attackingObject);
}