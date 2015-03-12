/**
 * Used to calculate damage during an attack
 * @param  {Object} attackingObject
 * @param  {Object} defendingObject
 */

function calculateDamage(attackingObject, defendingObject) {
	// calculate position of attack animation
	attackingObject.attackAnimation.x = defendingObject.animations.x - defendingObject.spriteSheet._frameWidth / 2;
	attackingObject.attackAnimation.y = defendingObject.animations.y;
	
	// add and play attack animation
	renderer.activeObjectsContainer.addChild(attackingObject.attackAnimation);
	attackingObject.attackAnimation.gotoAndPlay("slash");

	// notify defender of the attack
	console.log(defendingObject);
	defendingObject.receiveDamage(attackingObject);

	// remove animation when complete
	setTimeout(function() {
		renderer.activeObjectsContainer.removeChild(attackingObject.attackAnimation)
	}, 500);
}