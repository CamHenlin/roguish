/**
 * Used to calculate damage during an attack
 * @param  {Object} attackingObject
 * @param  {Object} defendingObject
 */
function calculateDamage(attackingObject, defendingObject) {
	defendingObject.receiveDamage(attackingObject.attack);
}