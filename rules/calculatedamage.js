/**
 * Used to calculate damage during an attack
 * @param  {Object} attackingObject
 * @param  {Object} defendingObject
 */

function calculateDamage(attackingObject, defendingObject) {
	/*
	attackingObject.attackAnimation.x = defendingObject.x;
	attackingObject.attackAnimation.y = defendingObject.y;
	renderer.fogOfWarContainer.addChild(attackingObject.attackAnimation);
	attackingObject.attackAnimation.gotoAndPlay("slash");
	//setTimeout(renderer.fogOfWarContainer.removeChild(attackingObject.attackAnimation),1000);
*/
	defendingObject.receiveDamage(attackingObject.attack);
}